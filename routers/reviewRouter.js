const express = require("express");
const Router = express.Router();
const authController = require("../controller/authController");
const reviewController = require("../controller/reviewController");
Router.use(authController.protect);
Router.post("/addReview", reviewController.addReview);
Router.get("/allReviews", reviewController.getAllReviews);
module.exports = Router;
