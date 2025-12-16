import { Comment } from "../models/Comment.js";
import { Article } from "../models/Article.js";
import { createNotification } from "../services/notificationService.js";
import { sendNotificationEmail } from "../utils/email.js";

//Get all comments for an article

// export const getCommentsByArticle = async (req, res) => {
//     try {
//         const comments = await Comment.find({ article: req.params.articleId }).populate("author", "name email").sort({ createdAt: -1 });
//         res.json(comments); 
//     }catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

export const getComments = async (req, res) => {
  try {
    const { page = 1, limit = 10, content } = req.query;

    const query = { article: req.params.articleId };

    if (content) query.content = { $regex: content, $options: "i" };

    const skip = (page - 1) * limit;

    const comments = await Comment.find(query)
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Comment.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      comments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Create a new comment for an article
export const createComment = async (req, res) => {
    try {
        const { content } = req.body;
        const article = await Article.findById(req.params.articleId);
        if (!article) 
            return res.status(404).json({ message: "Article not found" });
        
        const newComment = await Comment.create({
            content,
            author: req.user.userId,
            article: req.params.articleId,
        });

        // Populate author details for notification and email
        await article.populate('author', 'name email');

        await createNotification({
            recipient: article.author._id,
            actor: req.user.id,
            type: "comment",
            title: `${req.user.name || 'A user'} commented on your article`, // Use a fallback for user name
            body: newComment.content,
            url: `/articles/${article._id}#comment-${newComment._id}`,
            meta: { articleId: article._id, commentId: newComment._id }
        });

        // optional: send email
        await sendNotificationEmail({
            to: article.author.email,
            title: "New comment on your article",
            body: `${req.user.name || 'A user'} commented: ${newComment.content}`,
            url: `${process.env.FRONTEND_URL}/articles/${article._id}`
        });

        res.status(201).json(newComment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a comment
export const updateComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) 
            return res.status(404).json({ message: "Comment not found" });
        
        if (comment.author.toString() !== req.user.userId && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized" });
        }
        comment.content = req.body.content || comment.content;
        await comment.save();
        res.json(comment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a comment

export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) 
            return res.status(404).json({ message: "Comment not found" });
        
        if (comment.author.toString() !== req.user.userId && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized" });
        }

        await Comment.findByIdAndDelete(req.params.commentId);
        res.json({ message: "Comment deleted successfully" });
        } catch (error) {
        res.status(500).json({ message: error.message });
    }
};