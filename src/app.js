import express from 'express';
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";


import articleRoutes from './routes/articleRoutes.js';
import authRoutes from './routes/authRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { swaggerUiMiddleware, swaggerUiSetup } from './swagger.js';

const app = express();

// -------------------------
// 🔐 SECURITY MIDDLEWARE
// -------------------------
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
  })
);

// -------------------------
// 🔧 CORE MIDDLEWARE
// -------------------------
app.use(express.json());
app.use(cookieParser());

// CORS (IMPORTANT: use credentials for auth cookies)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// -------------------------
// 📦 ROUTES
// -------------------------
app.use("/api-docs", swaggerUiMiddleware, swaggerUiSetup);
app.use("/api/articles", articleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);

export default app;










// import express from 'express';
// import cors from "cors";
// import articleRoutes from './routes/articleRoutes.js';
// import authRoutes from './routes/authRoutes.js';
// import notificationRoutes from './routes/notificationRoutes.js';
// import { swaggerUiMiddleware, swaggerUiSetup } from './swagger.js';

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Routes
// app.use("/api-docs", swaggerUiMiddleware, swaggerUiSetup);
// app.use("/api/articles", articleRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/notifications", notificationRoutes);
// export default app;