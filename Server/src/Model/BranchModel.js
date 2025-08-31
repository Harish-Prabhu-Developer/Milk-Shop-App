import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const branchSchema = new mongoose.Schema({
    branchName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    address: String,
    contactPerson: String,
    location: String,
    registeredDate: {
        type: Date,
        default: Date.now,
    },
    password: {
        type: String,
        required: true,
    },
    routeName: String,
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    type: {
        type: String,
        enum: ["NKC Local", "NKC OUT", "AKC Local", "AKC OUT"],
        default: "NKC Local",
    },
    fcmToken: { type: String, default: null } // 🔹 optional
},
{
    timestamps: true, // Automatically manage createdAt and updatedAt fields
});



branchSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

branchSchema.methods.isValidPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model("Branch", branchSchema);
