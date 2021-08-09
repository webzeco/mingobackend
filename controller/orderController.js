const stripe = require("stripe")(
  "sk_test_51JL45oFh5EerqhFKJV0faXHcvKzvvP9492MHJ8Ujy9DEWOf65ztiwnaQ1sDVS7zIOimyO26KvaliRa0KIgsWgcZ90024MY94db"
);
const uuid = require("uuid").v4;
const Order = require("../models/OrderModel");
const catchAsync = require("../utils/catchAsync");
exports.addOrder = catchAsync(async (req, res) => {
  const { data } = req.body;
  data.customer = req.user;
  data.name = "Muhammad Umer";
  data.email = "test@gmail.com";
  console.log({ order: data });
  
  const order = await Order.create(data);
  res.status(201).json({
    status: "success",
    data,
  });
});

exports.getPayment = catchAsync(async (req, res) => {
  const { product, token } = req.body;
  console.log({ Product: product });
  console.log({ token: token });
  const idompontencyKey = uuid();
  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      console.log(product.price);
      stripe.charges.create(
        {
          amount: Math.round((product.price / 100) * 164),
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: `Purchases of ${product.price}`,
        },
        (err, data) => {
          if (err)
            res.status(200).json({
              status: "failed",
              charge: err,
            });
          else {
            res.status(200).json({
              status: "success",
              charge: data,
            });
          }
        }
      );
    })
    .catch((err) => {
      console.log(err);
    });
});

exports.getAllOrders = catchAsync(async (req, res) => {
  const order = await Order.find().populate("orderBy").populate("items.item");
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

//   await Admin.findByIdAndUpdate(req.user.id, {
//     $push: { users: [newUser.id] },
//   });
