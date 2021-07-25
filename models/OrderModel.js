const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  discount: {
    type: Number,
  },
  confirmedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "confirmation must be belong to User"],
  },
  subtotal: {
    type: Number,
  },
  total: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["pending","confirmed","delivered", "shipped"],
    default: "pending",
  },
  // shippingCharges: Number,
  shipping:{
    status:{
      type:String,
      enum:['done','pending'],
      default:'pending'
    },
    address:{
      type:String,
      required:true
    },
    province:{
      type:String,
      required:true
    },
    city: {
      type:String,
      required:true
    },
    area:{
      type:String,
      required:true
    },
    contactNo:{
      type:String,
      required:true
    },
    charges:Number
  },
  orderBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "order must be belong to User"],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  items: [
    {
    quantity:Number,
    price:Number,
    item:{
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "items must be belong to Product"],
    } }
  ],
});
OrderSchema.pre('save', function(next) {
  let total=0;
  this.items.map(item=>{
    total+=(item.price*item.quantity)
  });
  this.subtotal=total;
  next();
});
const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
