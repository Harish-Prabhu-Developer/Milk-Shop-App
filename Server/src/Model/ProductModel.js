// ProductModel.js
import mongoose from "mongoose";

//   name: string;
//   price: number;
//   unit: string;         // e.g., "1L", "500g"
//   description: string;
//   nutrition: string;
//   image: any;
//   category?: string;    // Optional: Milk, Curd, Paneer, etc.
//   isActive?: boolean;   // If set to false, hide from client

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  nutrition: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  category: {
    type: String,
    enum: ["milk"],
    default: "milk",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch", // Reference to Branch model
    required: true,
  },
});

export default mongoose.model("Product", productSchema);
