const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
  discount: {
    type: Number,
    default:0
  },
  subTotal: {
    type: Number,
    default:0
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: "Customer",
    required: [true, "cart must be belong to Customer"],
  },
  // customer:{
  //   type:String,
  //   required:[true, "Cart must be belong to Customer"]
  // },
  items: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      // required: [true, "items must be belong to Product"],
    },
  ],
});
const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
