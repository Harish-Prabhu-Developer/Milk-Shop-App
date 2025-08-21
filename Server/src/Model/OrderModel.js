// models/OrderModel.js
import mongoose from "mongoose";
import { cartItemSchema } from "./CartModel.js";



const OrderSchema =new mongoose.Schema({
    OrderId:{
        type: String,
        required: true,
        unique: true
    },
    ProductData:[cartItemSchema],
    Branch:{ type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
    OrderDate: { type: Date, default: Date.now },
    TotalAmount: { type: Number, default: 0 }, // Auto-calculated
    OrderStatus: { type: String, enum: ["Pending", "Processing", "Delivered", "Cancelled"], default: "Pending" },
    PaymentStatus: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
    ReceivedStatus: { type: String, enum: ["Pending", "Confirmed", "Partial", "Issue Reported"], default: "Pending" },
    ReceivedDate: { type: Date },
    ReceivedItems: [{ productId: String, receivedQty: Number }],
    ConfirmOrderDate: { type: Date },
    CancelOrderDate: { type: Date },
},
{ timestamps: true }

);


export default mongoose.model('Orders',OrderSchema);