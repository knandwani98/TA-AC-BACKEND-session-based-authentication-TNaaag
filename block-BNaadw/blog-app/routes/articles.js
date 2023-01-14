var express = require("express");
var router = express.Router();

var Article = require("../models/articleSchema");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("articles");
});

// New Article Form Page
router.get("/new", (req, res, next) => {
  res.render("createArticle");
});

// Creating an Article
router.post("/", (req, res, next) => {
  console.log(req.body, " - Data");
  Article.create(req.body, (err, article) => {
    if (err) return next(err);
    res.redirect("/articles");
  });
});

module.exports = router;
