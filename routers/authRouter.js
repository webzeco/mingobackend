const express = require("express");
const Router = express.Router();
const authController = require("../controller/authController");
// const userController = require("./../controller/userController");
Router.post("/signUp", authController.signUp);
Router.post("/login", authController.login);
Router.use(authController.protect);
Router.patch("/updatePassword", authController.updatePassword);
// Router.patch("/updateMe", userController.updateMe);

module.exports = Router;
