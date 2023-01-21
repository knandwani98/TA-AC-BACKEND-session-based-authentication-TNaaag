var express = require("express");
var router = express.Router();

var Product = require("../models/Product");

// INDEX PAGE
router.get("/", function (req, res, next) {
  Product.find({})
    .sort({ createdAt: -1 })
    .exec((err, products) => {
      if (err) return next(err);
      res.render("index", { products });
    });
});

// SINGLE PRODUCT
router.get("/:department/:id", function (req, res, next) {
  var productId = req.params.id,
    department = req.params.department;
  Product.findById(productId, (err, product) => {
    if (err) return next(err);
    res.render("singleProduct", { product });
  });
});

// MEN PRODUCTS
router.get("/men", function (req, res, next) {
  Product.find({ department: "men" })
    .sort({ createdAt: -1 })
    .exec((err, products) => {
      if (err) return next(err);
      res.render("men", { products });
    });
});

// WOMEN PRODUCTS
router.get("/women", function (req, res, next) {
  Product.find({ department: "women" })
    .sort({ createdAt: -1 })
    .exec((err, products) => {
      if (err) return next(err);
      res.render("women", { products });
    });
});

module.exports = router;
