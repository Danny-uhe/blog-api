import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getComments,
  createComment,
  deleteComment,
  updateComment,
} from "../controllers/commentController.js";

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Article comments management
 */

/**
 * @swagger
 * /api/articles/{articleId}/comments:
 *   get:
 *     summary: Get all comments for an article
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comments
 */
router.get("/", getComments);

/**
 * @swagger
 * /api/articles/{articleId}/comments:
 *   post:
 *     summary: Create a comment on an article
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: This article is very helpful!
 *     responses:
 *       201:
 *         description: Comment created
 */
router.post("/", protect, createComment);

/**
 * @swagger
 * /api/articles/{articleId}/comments/{commentId}:
 *   put:
 *     summary: Update a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: Updated comment content
 *     responses:
 *       200:
 *         description: Comment updated
 *       403:
 *         description: Not authorized
 */
router.put("/:commentId", protect, updateComment);

/**
 * @swagger
 * /api/articles/{articleId}/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted
 *       403:
 *         description: Not authorized
 */
router.delete("/:commentId", protect, deleteComment);

export default router;

















// import express from "express";
// import { protect } from "../middleware/authMiddleware.js";
// import {
//     getComments,
//     createComment,
//     deleteComment,
//     updateComment,
// } from "../controllers/commentController.js";

// const router = express.Router({ mergeParams: true });

// // Public route: Get all  comments for an article

// router.get("/", getComments);

// // Protected routes

// router.post("/", protect, createComment);
// router.put("/:commentId", protect, updateComment);
// router.delete("/:commentId", protect, deleteComment);

// export default router;