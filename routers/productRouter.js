const express = require("express");
const Router = express.Router();
const authController = require("./../controller/authController");
const productController = require("./../controller/productController");
Router.get("/allProducts", productController.getAllProducts);
Router.use(authController.protect);
Router.post("/addProduct",
productController.uploadMultiImages.array("images", 10), 
productController.saveImages,
productController.addProduct,
);
module.exports = Router;
