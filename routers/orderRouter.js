const express = require("express");
const Router = express.Router();
const orderController = require("../controller/orderController");
const authController=require('../controller/authController');
Router.use(authController.protect);
Router.use(authController.restrictTo('admin','user'));
Router.post("/addOrder", orderController.addOrder);
Router.get("/allOrders", orderController.getAllOrders);
Router.get("/detail/:id", orderController.getOrderDetail);



module.exports = Router;
