import { Notification } from "../models/Notification.js";
import { createNotification } from "../services/notificationService.js";

export const getNotifications = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const skip = (page - 1) * limit;
  const query = { recipient: req.user.id };

  const total = await Notification.countDocuments(query);

  const items = await Notification.find(query)
    .populate("actor", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.json({
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit),
    items,
  });
};

export const markAsRead = async (req, res) => {
  const { id } = req.params;

  const n = await Notification.findOneAndUpdate(
    { _id: id, recipient: req.user.id },
    { read: true },
    { new: true }
  );

  if (!n) return res.status(404).json({ message: "Not found" });

  res.json(n);
};

export const sendNotification = async (req, res) => {
  const { recipient, type, message, relatedArticle, relatedComment } = req.body;

  if (!recipient || !type || !message) {
    return res.status(400).json({ message: "Missing required fields: recipient, type, message" });
  }

  const notificationData = {
    recipient,
    actor: req.user.id,
    type,
    message,
    relatedArticle,
    relatedComment,
  };

  const notification = await createNotification(notificationData);

  res.status(201).json(notification);
};
