// models/CartModel.js
import mongoose from "mongoose";

export const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    }
});

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Branch", // or Branch if cart belongs to a branch
            required: true
        },
        items: [cartItemSchema]
    },
    { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
