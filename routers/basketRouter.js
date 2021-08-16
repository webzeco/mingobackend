const express = require("express");
const Router = express.Router();
const authController = require("./../controller/authController");
const basketController=require("./../controller/basketController");
Router.get("/getBaskets", basketController.getBaskets);
Router.use(authController.protect);
Router.use(authController.restrictTo('admin','user'));
Router.get("/allBaskets", basketController.getAllBaskets);
Router.post("/addBasket",
basketController.uploadImages.single("image"), 
basketController.saveImage,
basketController.addBasket
);
Router.delete("/delete/:id",
basketController.deleteBasket,
);                                  
Router.patch("/update/:id", basketController.updateBasket);


module.exports = Router;
