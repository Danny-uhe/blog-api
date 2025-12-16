import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    getComments,
    createComment,
    deleteComment,
    updateComment,
} from "../controllers/commentController.js";

const router = express.Router({ mergeParams: true });

// Public route: Get all  comments for an article

router.get("/", getComments);

// Protected routes

router.post("/", protect, createComment);
router.put("/:commentId", protect, updateComment);
router.delete("/:commentId", protect, deleteComment);

export default router;