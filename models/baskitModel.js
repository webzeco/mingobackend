const mongoose = require("mongoose");
const baskitSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: [true, "This Baskit  is already exits"],
    required: true,
  },
  price:String,
  image: String,
  status:{
    type:Boolean,
    default:true
  }
});
const Baskit = mongoose.model("Baskit", categorySchema);
module.exports = Baskit;
