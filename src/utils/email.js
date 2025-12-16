import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

// Configure nodemailer transporter

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Send verification email
export const sendEmail = async ({ to, subject, html }) => {

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
    });
};


export const sendVerificationEmail = async (user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "1d" });
  const url = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  const html = `<p>Hi ${user.name}, click <a href="${url}">here</a> to verify your email.</p>`;
  await sendEmail({ to: user.email, subject: "Verify your email", html });
};

export const sendResetPasswordEmail = async (user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "1h" });
  const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  const html = `<p>Reset your password: <a href="${url}">Click here</a></p>`;
  await sendEmail({ to: user.email, subject: "Reset your password", html });
};

// Helper notification email
export const sendNotificationEmail = async ({ to, title, body, url }) => {
  const html = `<p>${body}</p><p><a href="${url}">Open</a></p>`;
  await sendEmail({ to, subject: title, html });
};