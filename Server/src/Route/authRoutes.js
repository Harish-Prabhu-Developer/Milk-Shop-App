import express from "express";
import { getNotifications, loginBranch, registerBranch } from "../Controller/authController.js";
import { authenticateUser } from "../Middleware/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register",registerBranch);
authRouter.post("/login",loginBranch);
authRouter.get("/notifications",authenticateUser,getNotifications);


export default authRouter;