const express = require("express");
const Router = express.Router();
const authController = require("../controller/authController");
const reviewController = require("../controller/reviewController");
Router.post("/addReview", reviewController.addReview);
Router.use(authController.protect);
Router.get("/allReviews", reviewController.getAllReviews);
Router.delete("/deleteReview/:id", reviewController.deleteReview);
module.exports = Router;
