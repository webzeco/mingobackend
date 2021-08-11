const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
        // customer: {
        //     type: mongoose.Schema.ObjectId,
        //     ref: "User",
        //     required: [true, "Review must be belong to Customer"],
        // },
       
        name:String,
        email:String,
        reviewTitle:String,
        product: {
            type: mongoose.Schema.ObjectId,
            ref: "Product",
            // required: [true, "Review must be belong to Product"],
        },
        rating: {
            type:Number,
            required:[true,'Rating required']
        },
        createdAt: {
            type:Date,
            default:new Date()
        },
        feedback: {
            type:String,
        },
        favorite:{
          type:Boolean,
          default:false
        }
});
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "customer",
    select: "name",
  });
  this.populate({
    path: "product",
    select: "title price",
  });
next();
});
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
