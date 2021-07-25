const express = require("express");
const Router = express.Router();
const authController = require("../controller/authController");
const cartController = require("../controller/cartController");
Router.use(authController.protect);
Router.get("/getCart", cartController.getCart);
// Router.patch("/updateMe", userController.updateMe);

module.exports = Router;
