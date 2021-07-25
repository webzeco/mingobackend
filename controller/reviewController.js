
const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
exports.addReview = catchAsync(async (req, res) => {
    const data=req.body;
    data.customer=req.user;
  const review = await Review.create(data);
//   await Admin.findByIdAndUpdate(req.user.id, {
//     $push: { users: [newUser.id] },
//   });
  res.status(201).json({
    status: "success",
    newUser: review,
  });
});
