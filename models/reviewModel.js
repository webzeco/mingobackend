const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
        
        customer: {
            type: mongoose.Schema.ObjectId,
            ref: "Customer",
            required: [true, "Review must be belong to Customer"],
        },
        product: {
            type: mongoose.Schema.ObjectId,
            ref: "Product",
            required: [true, "Review must be belong to Product"],
        },
        rating: {
            type:Number,
            required:[true,'Rating required']
        },
        feedback: {
            type:String,
        }
});
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
