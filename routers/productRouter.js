const express = require("express");
const Router = express.Router();
const authController = require("./../controller/authController");
const productController = require("./../controller/productController");
Router.get("/allProducts", productController.getAllProducts);
Router.get("/products/:category/:subcategory",
productController.getProductsWithCategories,
); 
Router.use(authController.protect);
Router.use(authController.restrictTo('admin','user'));
Router.post("/addProduct",
productController.addProduct,
);

Router.delete("/delete/:id",
productController.deleteProduct,
);                                  
Router.patch("/addProductImages/:id",
productController.uploadImages.array("images", 10), 
productController.saveImages,
productController.addProductImages,
);

module.exports = Router;
