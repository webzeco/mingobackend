
const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
exports.addReview = catchAsync(async (req, res) => {
    const data=req.body;
    data.customer=req.user;
  const review = await Review.create(data);
  res.status(201).json({
    status: "success",
    data: review,
  });
});

exports.getAllReviews = catchAsync(async (req, res) => {
const reviews = await Review.find().populate([""]);
res.status(200).json({
  status: "success",
  data: reviews,
});
});