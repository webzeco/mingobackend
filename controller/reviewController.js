
const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
exports.addReview = catchAsync(async (req, res) => {
  console.log(req.body);
    const {name,email,rating,reviewTitle,feedback,product}=req.body;
    console.log({name,email,rating,reviewTitle,feedback,product});
  const review = await Review.create({name,email,rating,reviewTitle,feedback,product});
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

exports.deleteReview = catchAsync(async (req, res) => {
await Review.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
  });
  exports.updateReview = catchAsync(async (req, res) => {
    const {favorite}=req.body;
    await Review.findByIdAndUpdate(req.params.id,{favorite:favorite});
    const data= await Review.find();
      res.status(200).json({
        status: "success",
        data: data,
      });
      });