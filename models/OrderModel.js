const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  name:String,
  email:String,
  contactNo:String,
  discount: {
    type: Number,
  },
  confirmedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
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
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  paymentMethod: {
    type: String,
  },
  payment: {
    charge:{},
    id: { type: String },
    status: { type: String },
    update_time: { type: String },
    email_address: { type: String },
  },
   products: [
      {
        addBucket: { type: Boolean, required: true },
        quantity: { type: Number, required: true },
        // image: { type: String, required: true },
        basePrice: { type: Number, required: true },
        totalProductPrice:{type:Number,required:true},
        product: {
          // type: mongoose.Schema.Types.ObjectId,
          // required: true,
          // ref: 'Product',
        },
    },
    ],
});
// OrderSchema.pre('save', function(next) {
//   let total=0;
//   this.orderItems.map(item=>{
//     console.log({me:item.price});
//     total=total+(item.price*item.qty)
//   });
//   this.subtotal=total;
//   next();
// });
OrderSchema.pre('save', function(next) {
  this.total=this.subtotal+this.shipping.charges;
  next();
});
const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
