const stripe= require("stripe");
const uuid=require("uuid");
const Order = require("../models/OrderModel");
const catchAsync = require("../utils/catchAsync");
exports.addOrder = catchAsync(async (req, res) => {
  const data = req.body;
  data.customer = req.user;
  const order = await Order.create(data);
  //   await Admin.findByIdAndUpdate(req.user.id, {
  //     $push: { users: [newUser.id] },
  //   });
  res.status(201).json({
    status: "success",
    order,
  });
});

exports.getPayment = catchAsync(async (req, res) => {
  const {product,token} = req.body;
  console.log("Product",product);
  console.log("Price",product.price);
  const idompontencyKey=uuid();
  return stripe.customers
  data.customer = req.user;
  const order = await Order.create(data);
  //   await Admin.findByIdAndUpdate(req.user.id, {
  //     $push: { users: [newUser.id] },
  //   });
  res.status(201).json({
    status: "success",
    order,
  });
});

exports.getAllOrders = catchAsync(async (req, res) => {
  const order = await Order.find()
    .populate("orderBy")
    .populate("items.item");
  res.status(200).json({
    status: "success",
    data: order,
  });
});


exports.getOrderDetail = catchAsync(async (req, res) => {
  const _id = req.params.id;
  const order = await Order.findOne({ _id })
    .populate("items")
    .populate("orderBy");
  res.status(201).json({
    status: "success",
    data: order,
  });
});
