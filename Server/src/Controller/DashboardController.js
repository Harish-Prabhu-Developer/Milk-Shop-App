// controllers/DashboardController.js

import OrderModel from "../Model/OrderModel.js";

// 📊 Dashboard Summary Controller
export const getDashboardSummary = async (req, res) => {
  try {
    // ------------------------------
    // 1. Card Analytics (total, delivered, pending, revenue)
    // ------------------------------
    const totalOrders = await OrderModel.countDocuments({});
    const delivered = await OrderModel.countDocuments({ OrderStatus: "Delivered" });
    const pending = await OrderModel.countDocuments({ OrderStatus: "Pending" });
    const processing= await OrderModel.countDocuments({OrderStatus:"Processing"});
    const cancelled= await OrderModel.countDocuments({OrderStatus:"Cancelled"});
    const revenueAgg = await OrderModel.aggregate([
      { $match: { OrderStatus: "Delivered" } },
      { $group: { _id: null, totalRevenue: { $sum: "$TotalAmount" } } },
    ]);
    const revenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // ------------------------------
    // 2. Last 7 Days Sales (group by day)
    // ------------------------------
    const today = new Date();
    const last7Days = new Date(today);
    last7Days.setDate(today.getDate() - 6);

    const sales = await OrderModel.aggregate([
      {
        $match: {
          OrderDate: { $gte: last7Days, $lte: today },
          OrderStatus: "Delivered",
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$OrderDate" },
          value: { $sum: "$TotalAmount" },
        },
      },
    ]);

    // map dayOfWeek → label
    const dayMap = {
      1: "Sun",
      2: "Mon",
      3: "Tue",
      4: "Wed",
      5: "Thu",
      6: "Fri",
      7: "Sat",
    };

    // Initialize all 7 days with 0
    const last7Sales = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(last7Days);
      d.setDate(last7Days.getDate() + i);
      const dow = d.getDay() + 1; // Mongo dayOfWeek starts from 1=Sun
      const found = sales.find((s) => s._id === dow);
      last7Sales.push({
        label: dayMap[dow],
        value: found ? found.value : 0,
      });
    }

    // ------------------------------
    // 3. Recent 5 Orders (populate branch + products)
    // ------------------------------
    const recentOrders = await OrderModel.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("Branch", "branchName email phone role")
      .populate("ProductData.product", "name price unit category description image nutrition isActive createdBy");

    const recent5Orders = recentOrders.map((order, index) => ({
      id: index + 1,
      branchName: order.Branch?.branchName || "N/A",
      status: order.OrderStatus,
      amount: order.TotalAmount,
      orderdetails: order.toObject(),
    }));

    // ------------------------------
    // Final Response
    // ------------------------------
    const DashboardSummary = {
      CardAnalytics: {
        totalOrders,
        delivered,
        pending,
        processing,
        cancelled,
        revenue,
      },
      Last7Sales: last7Sales,
      Recent5Orders: recent5Orders,
    };

    res.json(DashboardSummary);
  } catch (error) {
    console.error("Dashboard Summary Error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard summary" });
  }
};
