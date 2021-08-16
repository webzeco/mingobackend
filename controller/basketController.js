const multer = require("multer");
const Basket = require("../models/baskitModel");
const catchAsync = require("../utils/catchAsync");

// multiple images uploads
const imagesStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const imagesFilter = (req, file, cb) => {
  console.log("image filtered");
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Please upload images", 400), false);
  }
};

const imagesUpload = multer({
  storage: imagesStorage,
  fileFilter: imagesFilter,
});

exports.uploadImages = imagesUpload;
// save to the database in image array

exports.saveImage = catchAsync(async (req, res, next) => {
      req.body.image=req.file?.filename;
  next();
});


exports.addBasket = catchAsync(async (req, res) => {
    await Basket.create(req.body);
    const basket = await Basket.find();
    res.status(201).json({
      status: "success",
     data: basket,
    });
    });
    exports.getAllBaskets = catchAsync(async (req, res) => {
        const baskets = await Basket.find();
        res.status(200).json({
          status: "success",
         data: baskets,
        });
        });
        exports.getBaskets = catchAsync(async (req, res) => {
            const baskets = await Basket.find({status:true});
            res.status(200).json({
              status: "success",
             data: baskets,
            });
            }); 

exports.deleteBasket = catchAsync(async (req, res) => {
  const id=req.params.id;
const product = await Basket.findByIdAndDelete(id);
res.status(204).json({
  status: "success",
  product,
});
})

exports.updateBasket = catchAsync(async (req, res) => {
    const {status}=req.body;
    console.log({status});
    await Basket.findByIdAndUpdate(req.params.id,{status:status});
    const data= await Basket.find();
      res.status(200).json({
        status: "success",
        data: data,
      });
      });