import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { RefreshToken } from "../models/RefreshToken.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from "../utils/tokens.js";
import {
  sendVerificationEmail,
  sendResetPasswordEmail
} from "../utils/email.js";

/** Helper: Create + store + send tokens **/
const createAndSendTokens = async (res, user, deviceInfo = null) => {
  // Generate tokens using your token utils
  const accessToken = signAccessToken({ id: user._id, role: user.role });
  const refreshToken = signRefreshToken({ id: user._id });

  // Decode refresh token to extract expiry
  const decoded = jwt.decode(refreshToken);
  const expiresAt = new Date(decoded.exp * 1000);

  // Store refresh token in DB (for token revocation)
  await RefreshToken.create({
    token: refreshToken,
    user: user._id,
    expiresAt,
    deviceInfo,
  });

  // Set httpOnly secure cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: "/",
    maxAge: expiresAt.getTime() - Date.now(),
  });

  return { accessToken };
};

/** REGISTER **/
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    await sendVerificationEmail(user);

    res
      .status(201)
      .json({ message: "User registered. Check your email for verification." });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/** LOGIN **/
export const login = async (req, res) => {
  try {
    const { email, password, deviceInfo } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    const { accessToken } = await createAndSendTokens(res, user, deviceInfo);

    res.json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/** REFRESH TOKEN (ROTATION + SECURITY) **/
export const refresh = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token)
    return res.status(401).json({ message: "No refresh token" });

  const stored = await RefreshToken.findOne({ token });

  // Token not found = stolen / reused
  if (!stored) {
    return res.status(401).json({ message: "Refresh token revoked or invalid" });
  }

  try {
    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.id);
    if (!user)
      return res.status(401).json({ message: "User no longer exists" });

    // MUST delete old token → prevents replay attacks
    await RefreshToken.deleteOne({ token });

    // Issue new tokens
    const { accessToken } = await createAndSendTokens(
      res,
      user,
      stored.deviceInfo
    );

    res.json({ accessToken });

  } catch (err) {
    // Any verification error → delete and force re-login
    await RefreshToken.deleteOne({ token });
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

/** LOGOUT **/
export const logout = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    await RefreshToken.deleteOne({ token });
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: "/",
  });

  res.json({ message: "Logged out successfully" });
};

/** REQUEST PASSWORD RESET **/
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always respond same message for security
    if (user) {
      await sendResetPasswordEmail(user);
    }

    res.json({
      message:
        "If that email is registered, a password reset link has been sent.",
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};









// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { User } from "../models/User.js";
// import { RefreshToken } from "../models/RefreshToken.js";
// import { 
//   generateAccessToken, 
//   generateRefreshToken, 
//   verifyRefreshToken 
// } from "../utils/tokens.js";
// import { sendVerificationEmail, sendResetPasswordEmail } from "../utils/email.js";

// // Helper to create & send tokens
// const createAndSendTokens = async (res, user, deviceInfo = null) => {
//   // Use the correct imported function names
//   const accessToken = generateAccessToken(user); // user has _id and role
//   const refreshToken = generateRefreshToken(user); // only uses _id

//   // Store refresh token in DB
//   const decoded = jwt.decode(refreshToken);
//   const expiresAt = new Date(decoded.exp * 1000);

//   await RefreshToken.create({
//     token: refreshToken,
//     user: user._id,
//     expiresAt,
//     deviceInfo,
//   });

//   // Set refresh token as httpOnly cookie
//   res.cookie("refreshToken", refreshToken, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production", // better than string comparison
//     sameSite: "lax",
//     domain: process.env.COOKIE_DOMAIN,
//     path: "/", // explicitly set path
//     maxAge: expiresAt.getTime() - Date.now(),
//   });

//   return { accessToken, refreshToken };
// };

// // Register
// export const register = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     const exists = await User.findOne({ email });
//     if (exists) return res.status(400).json({ message: "Email already in use" });

//     const hashed = await bcrypt.hash(password, 10);
//     const user = await User.create({ name, email, password: hashed });

//     await sendVerificationEmail(user);

//     res.status(201).json({ message: "User created. Verify your email." });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Login
// export const login = async (req, res) => {
//   try {
//     const { email, password, deviceInfo } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(400).json({ message: "Invalid credentials" });

//     const { accessToken } = await createAndSendTokens(res, user, deviceInfo);

//     res.json({ 
//       accessToken, 
//       user: { 
//         id: user._id, 
//         name: user.name,
//         email: user.email, 
//         role: user.role 
//       } 
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Refresh token
// export const refresh = async (req, res) => {
//   const token = req.cookies.refreshToken;
//   if (!token) return res.status(401).json({ message: "No refresh token" });

//   const stored = await RefreshToken.findOne({ token });
//   if (!stored) return res.status(401).json({ message: "Refresh token revoked or invalid" });

//   try {
//     const payload = verifyRefreshToken(token);
//     const user = await User.findById(payload.id);
//     if (!user) return res.status(401).json({ message: "User not found" });

//     // Token rotation: delete old one
//     await RefreshToken.deleteOne({ token });

//     // Issue new tokens
//     const { accessToken } = await createAndSendTokens(res, user, stored.deviceInfo);

//     res.json({ accessToken });
//   } catch (err) {
//     // Invalid token → revoke it
//     await RefreshToken.deleteOne({ token });
//     return res.status(401).json({ message: "Invalid refresh token" });
//   }
// };

// // Logout
// export const logout = async (req, res) => {
//   const token = req.cookies.refreshToken;
//   if (token) {
//     await RefreshToken.deleteOne({ token });
//   }

//   res.clearCookie("refreshToken", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     domain: process.env.COOKIE_DOMAIN,
//     path: "/",
//   });

//   res.json({ message: "Logged out successfully" });
// };

// // Request password reset
// export const requestPasswordReset = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });

//     // Always return same message (security: don't reveal if email exists)
//     if (user) {
//       await sendResetPasswordEmail(user);
//     }

//     res.json({ message: "If account exists, a password reset email has been sent." });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

