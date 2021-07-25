const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    unique: [true, "This category this is already exits"],
    required: true,
  },
  description:String,
  subCategories: [{name:String,description:String}],
});
const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
