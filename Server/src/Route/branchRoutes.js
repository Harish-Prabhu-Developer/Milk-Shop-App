import express from "express";
import { authenticateUser } from "../Middleware/authMiddleware.js";
import { authorizeRoles } from "../Middleware/roleMiddleware.js";
import { createBranch, deleteBranch, getAllBranches, getBranch, updateBranch } from "../Controller/branchController.js";


const branchRouter = express.Router();
branchRouter.post("/add",authenticateUser,authorizeRoles("admin"),createBranch);
branchRouter.get("/all",authenticateUser,authorizeRoles("admin"),getAllBranches);
branchRouter.get("/get/:id",authenticateUser,authorizeRoles("admin"),getBranch);
branchRouter.put("/update/:id",authenticateUser,authorizeRoles("admin"),updateBranch);
branchRouter.delete("/remove/:id",authenticateUser,authorizeRoles("admin"),deleteBranch);

export default branchRouter;