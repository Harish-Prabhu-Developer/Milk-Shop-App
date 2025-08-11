// routes/cartRoutes.js
import express from "express";
import { addToCart, clearCart, getCart, removeFromCart, updateCartItem } from "../Controller/cartController.js";
import { authenticateUser } from "../Middleware/authMiddleware.js";

const cartRouter = express.Router();

cartRouter.post("/add", authenticateUser, addToCart);
cartRouter.get("/", authenticateUser, getCart);
cartRouter.put("/update", authenticateUser, updateCartItem);
cartRouter.delete("/remove/:productId", authenticateUser, removeFromCart);
cartRouter.patch("/clear",authenticateUser,clearCart);
export default cartRouter;
