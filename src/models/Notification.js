import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}, // who triggered the notification
    type: { type: String, enum: ['like', 'comment', 'follow', 'mention'], required: true }, // notification type
    title: { type: String }, // brief title or summary
    body: { type: String }, // detailed message
    url: { type: String }, // link to related content
    read: { type: Boolean, default: false }, // notification status
    meta: { type: mongoose.Schema.Types.Mixed }, // additional data
}, {
    timestamps: true
}
);

export const Notification = mongoose.model('Notification', notificationSchema);