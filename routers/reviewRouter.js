const express = require("express");
const Router = express.Router();
const authController = require("../controller/authController");
const reviewController = require("../controller/reviewController");
Router.use(authController.protect);
Router.post("/addReview", reviewController.addReview);
module.exports = Router;
