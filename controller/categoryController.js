const Category = require("../models/categoryModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllCategories=catchAsync(async (req, res) => {
  const data = await Category.find();
  res.status(200).json({ data });
});

exports.addcategory = catchAsync(async (req, res) => {
    const { category } = req.body;
    await Category.create({
      category
    });
    const  data= await Category.find();
    res.status(201).json({
       data,
    });
  });
  exports.getSubcategories=catchAsync(async (req, res) => {
    const category = await Category.findOne({category:req.params.category});
    res.status(200).json({ data:category.subCategories });
  });


  exports.deleteSubcategory=catchAsync(async (req, res) => {
    const {category,subCategory}=req.params;
    let data = await Category.findOne({category});
    const rmc=data.subCategories.filter(d=>d.name!==subCategory);
    await Category.findOneAndUpdate({category},{subCategories:rmc});
    data= await Category.find();
    res.status(200).json({ data });
  });
  
  exports.addSubCategory = catchAsync(async (req, res) => {
    const { category } = req.params;
    const {  subCategory,description } = req.body;
    const newSubCate = { name: subCategory, description};
    const reqCategory = await Category.findOne({  category });
    console.log({reqCategory});
    reqCategory.subCategories.push(newSubCate);
    await Category.findByIdAndUpdate(reqCategory._id, {
      subCategories: reqCategory.subCategories,
    });
    const allCate = await Category.find();
    res.status(201).json({
      data: allCate,
    });
  });

  exports.editSubCategory = catchAsync(async (req, res) => {
    console.log(req.body);
    const { cate,subcate } = req.params;
    const filename = req.file ? req.file.filename:null;
    const newSubCate = { name: subcate, image: filename, slug: slug };
    const category = await Category.findOne({ category: cate });
   const index= category.subCategory.findIndex(e=> e.name===subcate );
   console.log({index:index});
   const subcategory= category.subCategory[index];
   subcategory.name=subcate;
   if (filename) subcategory.image=filename;
   subcategory.slug=slug;
   category.subCategory[index]=subcategory;
   console.log({subcategory});
    await Category.findByIdAndUpdate(category._id, {
      subCategory: category.subCategory,
    });
    const allCate = await Category.find();
    res.status(201).json({
      data: allCate,
    });
  });

  exports.removeCategory = catchAsync(async (req, res) => {
    const category = req.params.category;
    await Category.findOneAndRemove({ category });
    const allCate = await Category.find();
    res.status(201).json({
      data: allCate,
    });
  });
  exports.getAllCate = catchAsync(async (req, res) => {
    const data = await Category.find();
    res.status(200).json({ data });
  });

 
 