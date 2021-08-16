const mongoose = require("mongoose");
const basketSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: [true, "This Basket  is already exits"],
    required: true,
  },
  price:String,
  image: String,
  status:{
    type:Boolean,
    default:true
  }
});
const Basket = mongoose.model("Basket", basketSchema);
module.exports = Basket;
