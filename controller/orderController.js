const stripe = require("stripe")(
  "sk_test_51JL45oFh5EerqhFKJV0faXHcvKzvvP9492MHJ8Ujy9DEWOf65ztiwnaQ1sDVS7zIOimyO26KvaliRa0KIgsWgcZ90024MY94db"
);
const Order = require("../models/OrderModel");
const catchAsync = require("../utils/catchAsync");
exports.addOrder = catchAsync(async (req, res) => {
  const { data, user } = req.body;
  console.log({ data, user });
  if (user) {
    data.guest = false;
    data.orderBy = user._id;
    (data.name = user.name),
      (data.email = user.email),
      (data.subtotal = data.subtotal - process.env.SIGNUP_DISCOUNT);
  } else {
    data.name = `${data.shipping.firstName} ${data.shipping.lastName}`;
    data.email = data.shipping.email;
  }
  data.products = data.list;
  const order = await Order.create(data);
  res.status(201).json({
    status: "success",
    data: order,
  });
});

exports.getPayment = catchAsync(async (req, res) => {
  // console.log({pay:req.body});
  const { id } = req.body;
  const { price, token } = req.body.data;
  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: Math.round((price / 100) * 164),
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: `Purchases of ${price}`,
        },
        async (err, data) => {
          if (err)
            res.status(200).json({
              status: "failed",
              charge: err,
            });
          else {
            try {
              await Order.findByIdAndUpdate(id, { "payment.charge": data });
              res.status(200).json({
                status: "success",
                charge: data,
              });
            } catch (err) {
              res.status(200).json({
                status: "failed",
                charge: err,
              });
            }
          }
        }
      );
    })
    .catch((err) => {
      console.log(err);
    });
});

exports.getAllOrders = catchAsync(async (req, res) => {
  const order = await Order.find()
    .populate("orderBy")
    .populate("products.product");
  res.status(200).json({
    status: "success",
    data: order,
  });
});

exports.getUserOrdersRecord = catchAsync(async (req, res) => {
  const userOrders = await Order.find({ guest: false })
    .populate("orderBy")
    .populate("items.item");
  const requiredOrders = userOrders.filter(
    (order) => order.orderBy.email == req.user.email
  );
  res.status(200).json({
    status: "success",
    count: requiredOrders.length,
    data: requiredOrders,
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

exports.changeStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  await Order.findByIdAndUpdate(id, { status });
  res.status(201).json({
    status: "success",
    data: { message: "Order status successfully updated" },
  });
});

//   await Admin.findByIdAndUpdate(req.user.id, {
//     $push: { users: [newUser.id] },
//   });
