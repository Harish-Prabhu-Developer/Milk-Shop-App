// controllers/ReportController.js
import BranchModel from "../Model/BranchModel.js";
import OrderModel from "../Model/OrderModel.js"; 
import PlaceModel from "../Model/PlaceModel.js";
/**
 * Generate Sales Report grouped by Branch and Date
 * @route GET /api/reports/sales
 * @query startDate, endDate, branchId
 */
export const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate, branchId } = req.query;

    // Build filter conditions
    const filter = {};
    if (startDate && endDate) {
      filter.OrderDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    if (branchId) {
      filter.Branch = branchId;
    }

    // Aggregate Orders
    const reportData = await OrderModel.aggregate([
      { $match: filter },

      // Lookup branch details
      {
        $lookup: {
          from: "branches", // collection name
          localField: "Branch",
          foreignField: "_id",
          as: "branch",
        },
      },
      { $unwind: "$branch" },

      // Lookup product details (to get price per liter/unit)
      {
        $lookup: {
          from: "products",
          localField: "ProductData.product",
          foreignField: "_id",
          as: "products",
        },
      },

      // Flatten orders per product item
      { $unwind: "$ProductData" },

      // Lookup price from products array
      {
        $lookup: {
          from: "products",
          localField: "ProductData.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },

      // Group sales by Branch & Date
      {
        $group: {
          _id: {
            branchId: "$branch._id",
            branchName: "$branch.branchName",
            phone: "$branch.phone",
            email: "$branch.email",
            contactPerson: "$branch.contactPerson",
            location: "$branch.location",
            routeName: "$branch.routeName",
            type: "$branch.type",
            date: {
              $dateToString: { format: "%Y-%m-%d", date: "$OrderDate" },
            },
            paymentStatus: "$PaymentStatus",
          },
          totalAmount: { $sum: "$TotalAmount" },
          totalLiter: { $sum: "$ProductData.quantity" },
          avgPrice: { $avg: "$productDetails.price" },
        },
      },

      // Reshape data
      {
        $group: {
          _id: {
            branchId: "$_id.branchId",
            branchName: "$_id.branchName",
            phone: "$_id.phone",
            email: "$_id.email",
            contactPerson: "$_id.contactPerson",
            location: "$_id.location",
            routeName: "$_id.routeName",
            type: "$_id.type",
          },
          sales: {
            $push: {
              date: "$_id.date",
              price: "$avgPrice",
              total: "$totalAmount",
              Paid: {
                $cond: [{ $eq: ["$_id.paymentStatus", "Completed"] }, "Yes", "No"],
              },
              LITER: "$totalLiter",
            },
          },
        },
      },

      // Final formatting
      {
        $project: {
          _id: 0,
          Branch: "$_id",
          sales: 1,
        },
      },
    ]);

    res.status(200).json(reportData);
  } catch (error) {
    console.error("Error generating sales report:", error);
    res.status(500).json({ message: "Failed to generate sales report", error });
  }
};


/**
 * Generate Delivery Report
 * Combines Orders with Branch & Place
 */
export const getDeliveryReport = async (req, res) => {
  try {
    const { startDate, endDate, routeGroup, vehicleType } = req.query;

    // Build filter
    const orderFilter = {};
    if (startDate && endDate) {
      orderFilter.OrderDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const reportData = await OrderModel.aggregate([
      { $match: orderFilter },

      // Join Branch
      {
        $lookup: {
          from: "branches",
          localField: "Branch",
          foreignField: "_id",
          as: "branch",
        },
      },
      { $unwind: "$branch" },

      // Join Place (by branchName → Place.Route.Branch Name)
      {
        $lookup: {
          from: "places",
          let: { branchName: "$branch.branchName" },
          pipeline: [
            { $unwind: "$Route" },
            {
              $match: {
                $expr: { $eq: ["$Route.Branch Name", "$$branchName"] },
              },
            },
          ],
          as: "place",
        },
      },
      { $unwind: { path: "$place", preserveNullAndEmptyArrays: true } },

      // Apply filters if provided
      ...(routeGroup ? [{ $match: { "place.RouteGroup": routeGroup } }] : []),
      ...(vehicleType ? [{ $match: { "place.type": vehicleType } }] : []),

      // Format exactly like your example
      {
        $project: {
          _id: 0,
          id: { $toString: "$_id" },
          routeGroup: "$place.RouteGroup",
          vehicleType: "$place.type",
          location: "$place.location",
          distance: "$place.distance",
          branchName: "$branch.branchName",
          orderId: "$OrderId",
          orderStatus: "$OrderStatus",
          totalAmount: "$TotalAmount",
        },
      },
    ]);

    res.status(200).json(reportData);
  } catch (error) {
    console.error("Error generating delivery report:", error);
    res.status(500).json({ message: "Failed to generate delivery report", error });
  }
};