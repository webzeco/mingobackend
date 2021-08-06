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
    firstName:String,
    lastName:String,
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
    zip: {
      type:Number,
      required:true
    },
   email :{
      type:String,
      required:true
    },
    // area:{
    //   type:String,
    //   required:true
    // },
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
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentResult: {
    id: { type: String },
    status: { type: String },
    update_time: { type: String },
    email_address: { type: String },
  },
   orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
});
OrderSchema.pre('save', function(next) {
  let total=0;
  this.orderItems.map(item=>{
    total+=(item.price*item.qty)
  });
  this.subtotal=total;
  next();
});
const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
