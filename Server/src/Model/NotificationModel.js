// models/NotificationModel.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["order", "payment", "delivery", "processing"], // keep in sync with frontend
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch", // or "Branch" if linked to branch instead of user
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Orders",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);


export default mongoose.model("Notification", notificationSchema);
