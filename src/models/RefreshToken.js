import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },

    // More flexible structured device info
    deviceInfo: {
      ip: String,
      userAgent: String,
      deviceName: String
    }
  },
  { timestamps: true }
);

export const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);










// import mongoose from 'mongoose';


// const refreshTokenSchema = new mongoose.Schema({
//     token: { type: String, required: true, unique: true},
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     createdAt: { type: Date, default: Date.now,},
//     expiresAt: { type: Date, required: true },
//     deviceInfo: { type: String }, // Optional: Store device or browser info
// });

// export const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);