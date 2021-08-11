const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    addedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "product must be belong to user"],
    },
    // reviews: [{
    //   type: mongoose.Schema.ObjectId,
    //   ref: "Review"
    //     }],
    title: {
      type: String,
      required: [true, "Title  is required"],
    },
    price: {
      type: Number,
      required: [true, "Title  is required"],
    },
    discount: {
      type: Number,
      default: 0,
    }, //discount will be zero if no discount is offered
    compareAtPrice: Number,
    costPerItem: Number,
    chargeTax: {
      type: Boolean,
      default: false,
    },
    stockKeepingUnit: String,
    barcode: String,
    trackQuantity: {
      type: Boolean,
      defaultL: true,
    },
    bucketPrice: {
      type: Number,
      default: 5,
    },
    sellOutOfStock: {
      type: Boolean,
      default: false,
    },
    availableQuantity: {
      type: Number,
    },
    physicalProduct: {
      type: Boolean,
      default: true,
    },
    images: [String],
    weight: Number,
    estimatedProcessingTime: {
      type: String,
    },
    deliveryTime: {
      type: Boolean,
      default: true,
    }, //will be used to set Option for delivery on specific date
    customWriting: {
      type: String,
      default: "Signature",
    }, //If empty then custom writting option will be disable and if not empty then we will take text input as text in string
    // reviews: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "Customer",
    //     required: [true, "Review must be belong to Customer"],
    //   },
    // ],
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    variants: [
      {
        selectedOption: String,
        tags: [
          { id:Number,img:String, text: String}
        ],
      }
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// this compound index is used for one user only can create one review one Tour
// reviewSchema.index({
//   tour: 1,
//   user: 1,
// }, {
//   unique: true,
// });
// productSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "user",
//     select: "name",
//   });
//   next();
// });

/*
// blow all about calculating average and numbers of Tour ratings

// this function get all saved reviews and apply aggregation on them
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([{
      $match: {
        tour: tourId,
      },
    },
    {
      $group: {
        _id: '$tour',
        nRating: {
          $sum: 1,
        },
        avgRating: {
          $avg: '$rating',
        },
      },
    },
  ]);
  // console.log(stats);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// this post run after creating and saving document
reviewSchema.post('save', function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.tour);
});

// findByIdAndUpdate
// findByIdAndDelete
// this pre middleware only used for getting current tour
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.Rew = await this.findOne();
  next();
});
// this post run after deleting and updating document
reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await this.Rew.constructor.calcAverageRatings(this.Rew.tour._id);
});
*/
productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id'
});
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
