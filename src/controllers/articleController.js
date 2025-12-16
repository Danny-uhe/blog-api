import { Article } from "../models/Article.js";
import { Comment } from "../models/Comment.js";


export const getAllArticles = async (req, res) => {
  try {
    const { tag, title, content, page = 1, limit = 10 } = req.query;

    const query = {};

    if (tag) query.tags = tag;
    if (title) query.title = { $regex: title, $options: "i" };
    if (content) query.content = { $regex: content, $options: "i" };

    const skip = (page - 1) * limit;

    const articles = await Article.find(query)
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Article.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      articles,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getArticle = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const skip = (page - 1) * limit;

    const article = await Article.findById(req.params.id)
      .populate("author", "name email");

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Paginated comments
    const comments = await Comment.find({ article: req.params.id })
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalComments = await Comment.countDocuments({ article: req.params.id });

    res.json({
      article,
      comments: {
        total: totalComments,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalComments / limit),
        data: comments
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// Create a new article
export const createArticle = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        // Corrected: Article.create is an async method and should be awaited. 'new' is not needed.
        const newArticle = await Article.create({ 
            title,
             content,
              tags, 
              author: req.user.userId,
              image: req.file ? req.file.path : null
        });
        res.status(201).json(newArticle);
    } catch (error) {
        res.status(400).json({ message: error.message }); // Changed to 400 for validation/bad request errors
    }
};

// Update an article
export const updateArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }
        
        // Check if the user is the author (admins can bypass this)
        if (article.author.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized" });
        }
        
        // Update fields from request body
        article.title = req.body.title || article.title;
        article.content = req.body.content || article.content;
        article.tags = req.body.tags || article.tags;

        if (req.file) {
            article.image = req.file.path;
        }

        const updatedArticle = await article.save();
        res.json(updatedArticle);

    } catch (error) {
        res.status(400).json({ message: error.message }); // Changed to 400 for validation/bad request errors
    }
};

// Delete an article
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    // ✅ Check if user is author or admin
    if (article.author.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const toggleLike = async (req, res) => {
    const article = await Article.findById(req.params.id);

    if (!article) return res.status(404).json({ message: "Article not found" });

    const userId = req.user.userId;

    if (article.likes.includes(userId)) {
        article.likes = article.likes.filter(id => id.toString() !== userId);
    } else {
        article.likes.push(userId);
    }

    await article.save();
    res.json({ likes: article.likes.length, message: "Like toggled" });
}



export const searchAll = async (req, res) => {
    const { q } = req.query;

    if (!q) return res.json([]);

    const results = await Article.find ({
        $text: {$search: q }
    }).select("title content tags");
    res.json(results);
};

// Track article views (POST /api/articles/:id/view)
export const trackArticleView = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // 1. Increment total views
    article.views = (article.views || 0) + 1;

    // 2. Increment daily views
    const today = new Date();
    const dayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const recordIndex = article.viewsByDay.findIndex(r =>
      new Date(r.day).toDateString() === dayOnly.toDateString()
    );

    if (recordIndex !== -1) {
      article.viewsByDay[recordIndex].count += 1;
    } else {
      article.viewsByDay.push({ day: dayOnly, count: 1 });
    }

    await article.save();

    res.json({ message: "View counted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error tracking view", error });
  }
};
