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
    trackArticleView,   // ⭐ add this
} from "../controllers/articleController.js";

const router = express.Router();

// Nested route for comments
router.use("/:articleId/comments", commentRoutes);

// Public routes
router.get("/", getAllArticles);

// ⭐ MUST be before :id route!
router.post("/:id/view", trackArticleView);

router.get("/search", searchAll);
router.get("/:id", getArticle);

// Protected routes
router.post("/", protect, upload.single("image"), createArticle);
router.put("/:id", protect, upload.single("image"), updateArticle);
router.put("/:id/like", protect, toggleLike);

// Admin-only delete
router.delete("/admin/article/:id", protect, adminOnly, deleteArticle);

// Normal delete
router.delete("/:id", protect, deleteArticle);

export default router;







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