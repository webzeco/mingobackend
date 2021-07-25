const multer = require("multer");
const Product = require("../models/productModel");
const catchAsync = require("../utils/catchAsync");

// multiple images uploads
const imagesStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "-" +file.originalname);
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

const multiImageUpload = multer({
  storage: imagesStorage,
  fileFilter: imagesFilter,
});
exports.uploadMultiImages = multiImageUpload;
// save to the database in image array
exports.saveImages = catchAsync(async (req, res, next) => {
  
  req.body.images = [];
  if (req.files) {
    req.files.map(async (file) => {
      req.body.images.push(file.filename);
    });
  }
  next();
});


exports.addProduct = catchAsync(async (req, res) => {
    const data=req.body;
    data.variants=JSON.parse(data.variants)
    console.log(data.variants);
    console.log(req.file);
    data.addedBy=req.user;
  const newUser = await Product.create(data);
//   await Admin.findByIdAndUpdate(req.user.id, {
//     $push: { users: [newUser.id] },
//   });
  res.status(201).json({
    status: "success",
    newUser,
  });
});

exports.getAllProducts=catchAsync(async (req, res) => {
const data = await Product.find();
res.status(200).json({
  status: "success",
  data,
});
});