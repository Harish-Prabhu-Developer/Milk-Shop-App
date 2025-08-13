// controllers/orderController.js
import CartModel from "../Model/CartModel.js";
import OrderModel from "../Model/OrderModel.js";

export const createOrder = async (req, res) => {
    try {
        const userId = req.user._id;

        const cart = await CartModel.findOne({ user: userId }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ msg: "Cart is empty" });
        }
        
        // Build product data and calculate totals
        const productData = cart.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity
        }));



        // Calculate subtotal for each item
        const itemsWithSubTotal = cart.items.map((item) => ({
            ...item.toObject(),
            Total: item.product.price * item.quantity
        }));

        // Calculate total amount
        const totalAmount = itemsWithSubTotal.reduce((acc, item) => acc + item.Total, 0);
        const order = await OrderModel.create({
            OrderId: `ORD${Date.now()}${req.user.name}${Math.floor(Math.random() * 1000)}`,
            ProductData: productData,
            Branch: userId, // Replace with actual branch if needed
            TotalAmount: totalAmount,
            OrderStatus: "Pending",
            PaymentStatus: "Pending",
            ReceivedStatus: "Pending"
        });

        // Clear cart after order
        cart.items = [];
        await cart.save();

        res.status(201).json({ msg: "Order created successfully", order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update the Order
// Update the Order (including ReceivedItems)
export const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { ReceivedItems, ReceivedStatus, ReceivedDate, ...rest } = req.body;

        const order = await OrderModel.findById(id).populate("ProductData.product").populate("Branch","_id branchName email phone role");
        if (!order) return res.status(404).json({ msg: "Order not found" });

        // If ReceivedItems is provided, update them
        if (Array.isArray(ReceivedItems)) {
            order.ReceivedItems = ReceivedItems.map(item => ({
                id: item.id,
                receivedQty: item.receivedQty
            }));
        }

        // Optional: auto-update ReceivedStatus if all items are received
        if (ReceivedItems && order.ProductData.length > 0) {
            const totalOrderedQty = order.ProductData.reduce((sum, p) => sum + (p.quantity || 0), 0);
            const totalReceivedQty = ReceivedItems.reduce((sum, r) => sum + (r.receivedQty || 0), 0);

            if (totalReceivedQty === totalOrderedQty) {
                order.ReceivedStatus = "Confirmed";
                order.OrderStatus="Delivered";
            } else if (totalReceivedQty > 0) {
                order.ReceivedStatus = "Partial";
                order.OrderStatus="Delivered";
            } else {
                order.ReceivedStatus = "Pending";
                order.OrderStatus="Delivered";
            }
        }

        // If provided in request, manually override status/date
        if (ReceivedStatus) order.ReceivedStatus = ReceivedStatus;
        if (ReceivedDate) {
            order.ReceivedDate = new Date(ReceivedDate);
        } else if (ReceivedItems?.length > 0) {
            // Auto-set ReceivedDate if items are received
            order.ReceivedDate = new Date();
        }

        // Apply other updates if needed
        Object.assign(order, rest);

        await order.save();

        res.status(200).json({ msg: "Order updated", order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Delete the Order
export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await OrderModel.findByIdAndDelete(id);
        if (!order) return res.status(404).json({ msg: "Order not found" });

        res.status(200).json({ msg: "Order deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Orders for user
export const getOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await OrderModel.find({ Branch: userId }).populate("ProductData.product").populate("Branch","_id branchName email phone role");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all Orders (Admin)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find().populate("ProductData.product").populate("Branch","_id branchName email phone role");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
