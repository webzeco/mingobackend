const Cart = require("../models/cartModel");
const catchAsync = require("../utils/catchAsync");

exports.getCart = catchAsync(async (req, res, next) => {
      const cart= await Cart.findOne({customer:req.user.id});
      if (!cart) {
        return next(
          new AppError(
            "Cart not found",
            400
          )
        );
      }
    res.status(200).json({
      data:cart 
    });
  });