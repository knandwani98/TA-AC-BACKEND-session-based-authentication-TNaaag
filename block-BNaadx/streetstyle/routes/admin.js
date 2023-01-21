var express = require("express");
var router = express.Router();

var categories = ["men", "women", "kids"];

var Product = require("../models/Product");

// ADMIN PAGE
router.get("/", function (req, res, next) {
  Product.find({})
    .sort({ createdAt: -1 })
    .exec((err, products) => {
      if (err) return next(err);
      var flash = req.flash("flash")[0];
      res.render("admin/admin.ejs", { products, flash });
    });
});

// APP PRODUCT PAGE
router.get("/product/new", function (req, res, next) {
  res.render("admin/addProduct", { categories });
});

// CREATE PRODUCT
router.post("/product", function (req, res, next) {
  Product.create(req.body, (err, product) => {
    if (err) return next(err);
    req.flash("flash", "Product Added Successfully");
    res.redirect("/admin");
  });
});

// VIEW PRODUCT
router.get("/product/:productid", (req, res, next) => {
  var productId = req.params.productid;
  Product.findById(productId, (err, product) => {
    if (err) return next(err);
    var flash = req.flash("flash")[0];
    res.render("admin/product.ejs", { product, flash });
  });
});

// EDIT PRODUCT FORM
router.get("/product/:productid/edit", (req, res, next) => {
  var productId = req.params.productid;
  Product.findById(productId, (err, product) => {
    if (err) return next(err);
    res.render("admin/editProduct.ejs", { product, categories });
  });
});

// EDITED PRODUCT
router.post("/product/:id", (req, res, next) => {
  var productId = req.params.id;
  Product.findByIdAndUpdate(productId, req.body, (err, product) => {
    if (err) return next(err);
    req.flash("flash", "Product edited successfully");
    res.redirect("/admin/product/" + productId);
  });
});

// DELETE PRODUCT
router.get("/product/:productid/delete", (req, res, next) => {
  var productId = req.params.productid;
  Product.findByIdAndDelete(productId, (err, product) => {
    if (err) return next(err);
    req.flash("flash", "Product Deleted Successfully");
    res.redirect("/admin");
  });
});

module.exports = router;
