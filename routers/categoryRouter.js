const express = require("express");
const Router = express.Router();
const authController = require("../controller/authController");
const categoryController = require("../controller/categoryController");
Router.use(authController.protect);
Router.post("/addCategory", categoryController.addcategory);
Router.patch(
  "/addSubCategory/:category",
  categoryController.addSubCategory
);
// Router.patch(
//   "/editSubCate/:category/:subcategory",
//   categoryController.editSubCategory
// );

Router.get(
  "/subcategories/:category",
  categoryController.getSubcategories
);
Router.get(
  "/allCategories",
  categoryController.getAllCategories
);
Router.delete("/deleteCategory/:category", categoryController.removeCategory);
Router.delete("/deleteSubCategory/:category/:subCategory", categoryController.deleteSubcategory);

module.exports = Router;
