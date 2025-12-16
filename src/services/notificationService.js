import { io, online } from "../server.js";
import { Notification } from "../models/Notification.js";

export const createNotification = async (data) => {
  const n = await Notification.create(data);

  // Send to all online sockets for the recipient
  const sockets = online.get(n.recipient.toString());
  if (sockets) {
    for (const sid of sockets) io.to(sid).emit("notification", n);
  }

  return n;
};
