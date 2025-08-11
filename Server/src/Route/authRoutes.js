import express from "express";
import { loginBranch, registerBranch } from "../Controller/authController.js";

const authRouter = express.Router();

authRouter.post("/register",registerBranch);
authRouter.post("/login",loginBranch);

export default authRouter;