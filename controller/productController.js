const multer = require("multer");
const Product = require("../models/productModel");
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
  const data = req.body;
  data.addedBy = req.user;
  console.log({ data });
  const product = await Product.create(data);
  //   await Admin.findByIdAndUpdate(req.user.id, {
  //     $push: { users: [newUser.id] },
  //   });
  res.status(201).json({
    status: "success",
    product,
  });
});

exports.deleteProduct = catchAsync(async (req, res) => {
  const id = req.params.id;
  const product = await Product.findByIdAndDelete(id);
  res.status(200).json({
    status: "success",
    product,
  });
});

exports.updateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  data.addedBy = req.user;
  console.log({ data });
  const product = await Product.findByIdAndUpdate(id, data);
  res.status(201).json({
    status: "success",
    product,
  });
});
exports.addProductImages = catchAsync(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, {
    images: req.body.images,
  });
  res.status(201).json({
    status: "success",
    product,
  });
});

exports.getAllProducts = catchAsync(async (req, res) => {
  const data = await Product.find().populate("reviews");
  res.status(200).json({
    status: "success",
    data,
  });
});
exports.getProductsWithCategories = catchAsync(async (req, res) => {
  const { category, subcategory } = req.params;
  if (category === "bestSellers") {
    const data = await Product.find({ bestSeller: true });
    return res.status(200).json({ data });
  }
  if (category === "sale") {
    const data = await Product.find({ onSale: true });
    return res.status(200).json({ data });
  }
  const data = await Product.find({ category: `${category}/${subcategory}` });
  res.status(200).json({ data });
});

exports.changeStatusProduct = catchAsync(async (req, res) => {
  const { status } = req.body;
  console.log({ status });
  await Product.findByIdAndUpdate(req.params.id, { status: status });
  const data = await Product.find();
  res.status(200).json({
    status: "success",
    data: data,
  });
});
exports.changeBestSeller = catchAsync(async (req, res) => {
  const { status } = req.body;
  console.log({ status });
  await Product.findByIdAndUpdate(req.params.id, { bestSeller: status });
  const data = await Product.find();
  res.status(200).json({
    status: "success",
    data: data,
  });
});
exports.getProductById=catchAsync(async (req, res) => {
  const data=await Product.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: data,
  });
});
