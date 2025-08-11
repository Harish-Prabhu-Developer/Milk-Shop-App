import express from "express";
import { createOrder, deleteOrder, getAllOrders, getOrder, updateOrder } from "../Controller/orderController.js";
import { authenticateUser } from "../Middleware/authMiddleware.js";
import { authorizeRoles } from "../Middleware/roleMiddleware.js";

const OrderRoute =express.Router();


OrderRoute.post("/add",authenticateUser,createOrder);
OrderRoute.put("/edit/:id",authenticateUser,updateOrder);
OrderRoute.delete("/remove/:id",authenticateUser,deleteOrder);
OrderRoute.get("/",authenticateUser,getOrder);
OrderRoute.get("/all",authenticateUser,authorizeRoles("admin"),getAllOrders);

export default OrderRoute;