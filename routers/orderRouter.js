const express = require("express");
const Router = express.Router();
const orderController = require("../controller/orderController");
const authController=require('../controller/authController');
Router.post("/payment",orderController.getPayment);
Router.post("/addOrder", orderController.addOrder);
Router.use(authController.protect);
Router.use(authController.restrictTo('admin','user'));
Router.get("/allOrders", orderController.getAllOrders);
Router.patch("/changeStatus/:id", orderController.changeStatus);
Router.get("/detail/:id", orderController.getOrderDetail);
Router.get("/userOrders", orderController.getUserOrdersRecord);

module.exports = Router;