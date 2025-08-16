// productController.js

import ProductModel from "../Model/ProductModel.js";
import fs from "fs";
import path from "path";

// Create a new product
export const createProduct = async (req, res) => {
    try {
        const { name, price, unit, description, nutrition, image, category, isActive } = req.body;
        const imagePath = req.file.path;
        // Create product
        const newProduct = await ProductModel.create({
            name,
            price,
            unit,
            description,
            nutrition,
            image: imagePath?imagePath:image,
            category,
            isActive,
            createdBy: req.user._id,
        });

        res.status(201).json({
            msg: "Product created successfully",
            product: newProduct
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a product
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the existing product
        const existingProduct = await ProductModel.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ msg: "Product not found" });
        }

        // If a new file is uploaded, set image to its path
        if (req.file && req.file.path) {
            req.body.image = req.file.path;
        } else {
            // Keep old image if no new file uploaded
            req.body.image = existingProduct.image;
        }

        // Update product
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            msg: "Product updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Delete a product


export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the product first
        const deletedProduct = await ProductModel.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ msg: "Product not found" });
        }

        // If the product had an image, delete it from the folder
        if (deletedProduct.image) {
            const imagePath = path.join(process.cwd(), deletedProduct.image);

            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error("Error deleting image file:", err);
                } else {
                    console.log("Image deleted:", imagePath);
                }
            });
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await ProductModel.find().populate("createdBy", "_id branchName email phone");

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single product
export const getProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await ProductModel.findById(id);

        if (!product) {
            return res.status(404).json({ msg: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
