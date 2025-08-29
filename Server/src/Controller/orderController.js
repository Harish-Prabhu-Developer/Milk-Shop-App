// controllers/orderController.js
import CartModel from "../Model/CartModel.js";
import NotificationModel from "../Model/NotificationModel.js";
import OrderModel from "../Model/OrderModel.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await CartModel.findOne({ user: userId }).populate(
      "items.product"
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: "Cart is empty" });
    }

    // Build product data and calculate totals
    const productData = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
    }));

    // Calculate subtotal for each item
    const itemsWithSubTotal = cart.items.map((item) => ({
      ...item.toObject(),
      Total: item.product.price * item.quantity,
    }));

    // Calculate total amount
    const totalAmount = itemsWithSubTotal.reduce(
      (acc, item) => acc + item.Total,
      0
    );
    const userName = req.user?.name || "USR"; // fallback if name not available
    const namePart = userName.substring(0, 5).toUpperCase(); // take first 5 chars

    const order = await OrderModel.create({
      OrderId: `ORD${Date.now()}${namePart}${Math.floor(Math.random() * 1000)}`,
      ProductData: productData,
      Branch: userId, // Replace with actual branch if needed
      TotalAmount: totalAmount,
      OrderStatus: "Pending",
      PaymentStatus: "Pending",
      ReceivedStatus: "Pending",
    });

    // Clear cart after order
    cart.items = [];
    await cart.save();

    // inside createOrder, just before sending res.json
    await NotificationModel.create({
      title: "New Order Placed",
      message: `Order ${order.OrderId} has been placed successfully.`,
      type: "order",
      user: userId,   // or order.Branch
      order: order._id,
    });

    const fulneworder = await OrderModel.findById(order._id)
      .populate("ProductData.product")
      .populate("Branch", "_id branchName email phone role");
    res
      .status(201)
      .json({ msg: "Order created successfully", order: fulneworder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// ReOrder the Order (It is again Order on past Order )
// ReOrder the Order (Place a new order based on a past order)
export const ReOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Find the existing order
    const oldOrder = await OrderModel.findById(id)
      .populate("ProductData.product")
      .populate("Branch", "_id branchName email phone role");

    if (!oldOrder) return res.status(404).json({ msg: "Order not found" });

    // Prepare product data for new order
    const productData = oldOrder.ProductData.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
    }));

    // Calculate total amount again (in case prices changed, you may choose to re-fetch)
    const totalAmount = oldOrder.ProductData.reduce((acc, item) => {
      return acc + (item.product?.price || 0) * item.quantity;
    }, 0);
 const userName = req.user?.name || "USR"; // fallback if name not available
    const namePart = userName.substring(0, 5).toUpperCase(); // take first 5 chars
    // Create new order
    const newOrder = await OrderModel.create({
      OrderId: `ORD${Date.now()}${namePart}${Math.floor(Math.random() * 1000)}`,
      ProductData: productData,
      Branch: userId, // Replace with actual branch if needed
      TotalAmount: totalAmount,
      OrderStatus: "Pending",
      PaymentStatus: "Pending",
      ReceivedStatus: "Pending",
    });

    await NotificationModel.create({
      title: "Re-Order Placed",
      message: `Re-Order ${newOrder.OrderId} has been placed successfully.`,
      type: "order",
      user: userId,
      order: newOrder._id,
    });

    const fulneworder = await OrderModel.findById(newOrder._id)
      .populate("ProductData.product")
      .populate("Branch", "_id branchName email phone role");

    res
      .status(201)
      .json({ msg: "ReOrder placed successfully", order: fulneworder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update the Order (including ReceivedItems)
// Update the Order (including ReceivedItems)
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { ReceivedItems, ReceivedStatus, ReceivedDate, ...rest } = req.body;

    const order = await OrderModel.findById(id)
      .populate("ProductData.product")
      .populate("Branch", "_id branchName email phone role");
    if (!order) return res.status(404).json({ msg: "Order not found" });

    // ✅ Update ReceivedItems
    if (Array.isArray(ReceivedItems)) {
      ReceivedItems.forEach((received) => {
        const existing = order.ReceivedItems.find(
          (item) => String(item.productId) === String(received.productId)
        );

        if (existing) {
          existing.receivedQty = received.receivedQty;
        } else {
          order.ReceivedItems.push({
            productId: received.productId,
            receivedQty: received.receivedQty,
          });
        }
      });
    }

    // ✅ Auto-update statuses (per-product check)
    if (order.ReceivedItems.length === 0) {
      // Nothing received yet
      order.ReceivedStatus = "Pending";
      order.OrderStatus = "Processing";
    } else {
      let allReceived = true;
      let someReceived = false;

      order.ProductData.forEach((p) => {
        const received = order.ReceivedItems.find(
          (r) => String(r.productId) === String(p.product._id)
        );
        const receivedQty = received?.receivedQty || 0;

        if (receivedQty === 0) {
          allReceived = false;
        } else if (receivedQty < p.quantity) {
          allReceived = false;
          someReceived = true;
        } else if (receivedQty > 0) {
          someReceived = true;
        }
      });

      if (!someReceived) {
        order.ReceivedStatus = "Pending";
        order.OrderStatus = "Processing";
      } else if (allReceived) {
        order.ReceivedStatus = "Confirmed";
        order.OrderStatus = "Delivered";
      } else {
        order.ReceivedStatus = "Partial";
        order.OrderStatus = "Processing";
      }
    }

    // ✅ Set ReceivedDate
    if (ReceivedDate) {
      order.ReceivedDate = new Date(ReceivedDate);
    } else if (order.ReceivedItems.length > 0 && !order.ReceivedDate) {
      order.ReceivedDate = new Date();
    }

    // ✅ Apply extra updates from body
    Object.assign(order, rest);

    await order.save();

    // ✅ Notifications (deduplicated)
    if (order.PaymentStatus === "Completed") {
      await NotificationModel.create({
        title: "Payment Completed",
        message: `Payment for order ${order.OrderId} was successful.`,
        type: "payment",
        user: order.Branch._id,
        order: order._id,
      });
    }

    if (order.OrderStatus === "Delivered") {
      await NotificationModel.create({
        title: "Order Delivered",
        message: `Your order ${order.OrderId} has been delivered.`,
        type: "delivery",
        user: order.Branch._id,
        order: order._id,
      });
    } else if (order.OrderStatus === "Processing") {
      await NotificationModel.create({
        title: "Order Processing",
        message: `Your order ${order.OrderId} is being processed.`,
        type: "processing",
        user: order.Branch._id,
        order: order._id,
      });
    }

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
    await NotificationModel.create({
      title: "Order Cancelled",
      message: `Order ${order.OrderId} has been cancelled.`,
      type: "order",
      user: order.Branch._id,
      order: order._id,
    });

    res.status(200).json({ msg: "Order deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Orders for user
export const getOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    if (req.user.role === "admin") {
      const orders = await OrderModel.find()
        .populate("ProductData.product")
        .populate("Branch", "_id branchName email phone role");
      res.status(200).json(orders);
    } else {
      const orders = await OrderModel.find({ Branch: userId })
        .populate("ProductData.product")
        .populate("Branch", "_id branchName email phone role");
      res.status(200).json(orders);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all Orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate("ProductData.product")
      .populate("Branch", "_id branchName email phone role");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
