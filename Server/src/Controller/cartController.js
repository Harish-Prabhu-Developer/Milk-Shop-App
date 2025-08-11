// controllers/cartController.js

import CartModel from "../Model/CartModel.js";
import ProductModel from "../Model/ProductModel.js";

// Add product to cart
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user._id; // from authentication middleware

        // Validate product exists
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Find the user's cart
        const cart = await CartModel.findOne({ user: userId });

        if (!cart) {
            // Create new cart if none exists
            cart = new CartModel({ user: userId, items: [] });
        }

        // Check if product already in cart
        const existingItem = cart.items.find(
            (item) => item.product.toString() === productId
        );

        if (existingItem) {
            // Update quantity
            existingItem.quantity += quantity;
        } else {
            // Add new item
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();

        res.status(200).json({
            message: "Product added to cart",
            cart
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get cart
// Get cart
export const getCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await CartModel.findOne({ user: userId }).populate("items.product");

        if (!cart) {
            return res.status(200).json({ items: [], totalAmount: 0 });
        }

        // Calculate subtotal for each item
        const itemsWithSubTotal = cart.items.map((item) => ({
            ...item.toObject(),
            Total: item.product.price * item.quantity
        }));

        // Calculate total amount
        const totalAmount = itemsWithSubTotal.reduce((acc, item) => acc + item.Total, 0);

        const userCart = {
            ...cart.toObject(),
            items: itemsWithSubTotal,
            totalAmount
        };


        res.status(200).json(userCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Update quantity
export const updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user._id;

        const cart = await CartModel.findOne({pr });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item = cart.items.find(
            (i) => i.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({ message: "Product not in cart" });
        }

        item.quantity = quantity;
        await cart.save();

        res.status(200).json({ message: "Cart updated", cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Remove product from cart
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        const cart = await CartModel.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId
        );

        await cart.save();

        res.status(200).json({ message: "Product removed from cart", cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Clear cart
export const clearCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const cart = await CartModel.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({
            message: "Cart cleared successfully",
            cart
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
