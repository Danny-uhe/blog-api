import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";
import commentRoutes from "./commentRoutes.js";

import {
  getAllArticles,
  getArticle,
  searchAll,
  createArticle,
  updateArticle,
  deleteArticle,
  toggleLike,
  trackArticleView,
} from "../controllers/articleController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: Blog article management
 */

// Nested route for comments
router.use("/:articleId/comments", commentRoutes);

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Get all articles
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         example: 10
 *     responses:
 *       200:
 *         description: List of articles
 */
router.get("/", getAllArticles);

/**
 * @swagger
 * /api/articles/{id}/view:
 *   post:
 *     summary: Track article view
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: View recorded
 */
router.post("/:id/view", trackArticleView);

/**
 * @swagger
 * /api/articles/search:
 *   get:
 *     summary: Search articles
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         example: technology
 *     responses:
 *       200:
 *         description: Search results
 */
router.get("/search", searchAll);

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Get single article by ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article data
 *       404:
 *         description: Article not found
 */
router.get("/:id", getArticle);

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Create a new article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: My First Article
 *               content:
 *                 type: string
 *                 example: This is the article content
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Article created
 */
router.post("/", protect, upload.single("image"), createArticle);

/**
 * @swagger
 * /api/articles/{id}:
 *   put:
 *     summary: Update an article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article updated
 *       403:
 *         description: Not authorized
 */
router.put("/:id", protect, upload.single("image"), updateArticle);

/**
 * @swagger
 * /api/articles/{id}/like:
 *   put:
 *     summary: Like or unlike an article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Like toggled
 */
router.put("/:id/like", protect, toggleLike);

/**
 * @swagger
 * /api/articles/admin/article/{id}:
 *   delete:
 *     summary: Delete article (admin only)
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article deleted
 */
router.delete("/admin/article/:id", protect, adminOnly, deleteArticle);

/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     summary: Delete own article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article deleted
 */
router.delete("/:id", protect, deleteArticle);

export default router;















// import express from "express";
// import { protect, adminOnly } from "../middleware/authMiddleware.js";
// import { upload } from "../middleware/upload.js";
// import commentRoutes from "./commentRoutes.js";

// import {
//     getAllArticles,
//     getArticle,
//     searchAll,
//     createArticle,
//     updateArticle,
//     deleteArticle,
//     toggleLike,
//     trackArticleView,   // ⭐ add this
// } from "../controllers/articleController.js";

// const router = express.Router();

// // Nested route for comments
// router.use("/:articleId/comments", commentRoutes);

// // Public routes
// router.get("/", getAllArticles);

// // ⭐ MUST be before :id route!
// router.post("/:id/view", trackArticleView);

// router.get("/search", searchAll);
// router.get("/:id", getArticle);

// // Protected routes
// router.post("/", protect, upload.single("image"), createArticle);
// router.put("/:id", protect, upload.single("image"), updateArticle);
// router.put("/:id/like", protect, toggleLike);

// // Admin-only delete
// router.delete("/admin/article/:id", protect, adminOnly, deleteArticle);

// // Normal delete
// router.delete("/:id", protect, deleteArticle);

// export default router;







// import express from "express";
// import { protect } from "../middleware/authMiddleware.js";
// import { adminOnly } from "../middleware/authMiddleware.js";
// import { upload } from "../middleware/upload.js";
// import commentRoutes from "./commentRoutes.js";

// import {
//     getAllArticles,
//     getArticle,
//     searchAll,
//     createArticle,
//     updateArticle,
//     deleteArticle,
//     toggleLike
// } from "../controllers/articleController.js";

// const router = express.Router();

// // Nested route for comments on an article
// router.use("/:articleId/comments", commentRoutes);

// // Public routes
// router.get("/", getAllArticles);
// router.get("/:id", getArticle);
// router.get("/search", searchAll);

// // Protected routes - Create, Update, Like
// router.post("/", protect, upload.single("image"), createArticle);
// router.put("/:id", protect, upload.single("image"), updateArticle);
// router.put("/:id/like", protect, toggleLike);

// // ⭐ Admin-only delete route
// router.delete("/admin/article/:id", protect, adminOnly, deleteArticle);

// // Normal delete (optional — if you still want users to delete their own articles)
// router.delete("/:id", protect, deleteArticle);

// export default router;








// import express from "express";
// import { protect } from "../middleware/authMiddleware.js";
// import commentRoutes from "./commentRoutes.js";

// import {
//     getAllArticles,
//     getArticle,
//     createArticle,
//     updateArticle,
//     deleteArticle,
// } from "../controllers/articleController.js";

// const router = express.Router();

// // Nested route for comments on an article
// router.use("/:articleId/comments", commentRoutes);

// // Public routes
// router.get("/", getAllArticles);
// router.get("/:id", getArticle);

// // Protected routes
// router.post("/", protect, createArticle);
// router.put("/:id", protect, updateArticle);
// router.delete("/:id", protect, deleteArticle);

// export default router;