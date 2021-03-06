const express = require("express");
const Router = express.Router();
const authController = require("../controller/authController");
const userController = require("../controller/userController");
Router.use(authController.protect);
Router.get("/me", userController.getMe);
Router.patch("/addAddress/:id", userController.addAddress);
Router.patch("/updatePassword", authController.updatePassword);
Router.patch("/updateMe", userController.updateMe);
Router.post("/addUser", userController.addUser);
Router.get("/me", userController.getMe);
Router.use(authController.restrictTo("admin"));
Router.get("/getAllCustomer", userController.getAllCustomers);
Router.get("/staff", userController.getStaff);
Router.patch("/delete/:name", userController.deleteUser);

module.exports = Router;
