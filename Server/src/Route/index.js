import express from "express";
import authRouter from "./authRoutes.js";
import ProductRouter from "./productRoutes.js";
import cartRouter from "./cartRoutes.js";
import OrderRoute from "./orderRoutes.js";
import branchRouter from "./branchRoutes.js";
import placeRouter from "./placeRoutes.js";
import AnalyticsRoute from "./analyticsRoutes.js";
import ReportRoute from "./reportRoutes.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/products", ProductRouter);
router.use("/cart", cartRouter);
router.use("/order",OrderRoute);
router.use("/branch",branchRouter);
router.use("/place",placeRouter);
router.use("/analytics",AnalyticsRoute);
router.use("/reports", ReportRoute);
export default router;