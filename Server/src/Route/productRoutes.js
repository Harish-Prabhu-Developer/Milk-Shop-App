import express from "express";
import { createProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from "../Controller/productController.js";
import { authenticateUser } from "../Middleware/authMiddleware.js";
import { authorizeRoles } from "../Middleware/roleMiddleware.js";
import { uploadProduct } from "../Middleware/uploadMiddleware.js";

const ProductRouter = express.Router();

ProductRouter.post("/add",authenticateUser,authorizeRoles("admin"),uploadProduct,createProduct);
ProductRouter.get("/all",getAllProducts);
ProductRouter.get("/get/:id",getProduct);
ProductRouter.put("/update/:id",authenticateUser,authorizeRoles("admin"),uploadProduct,updateProduct);
ProductRouter.delete("/remove/:id",authenticateUser,authorizeRoles("admin"),deleteProduct);


export default ProductRouter;