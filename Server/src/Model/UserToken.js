import mongoose from "mongoose";

const userTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Or String if your userId is custom
      required: true,
    },
    fcmToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure a userId+fcmToken combination is unique
userTokenSchema.index({ userId: 1, fcmToken: 1 }, { unique: true });

export default mongoose.model("UserToken", userTokenSchema);
