import express from "express";
import authRouter from "./authRoutes.js";
import ProductRouter from "./productRoutes.js";
import cartRouter from "./cartRoutes.js";
import OrderRoute from "./orderRoutes.js";
import branchRouter from "./branchRoutes.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/products", ProductRouter);
router.use("/cart", cartRouter);
router.use("/order",OrderRoute);
router.use("/branch",branchRouter);
export default router;