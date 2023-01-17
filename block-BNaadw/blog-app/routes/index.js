var express = require("express");

var User = require("../models/User");
var Article = require("../models/Article");

var router = express.Router();

// DASHBOARD PAGE
router.get("/", function (req, res, next) {
  if (req.session.user && req.cookies["connect.sid"]) {
    var author = req.session.user._id;
    console.log(author);
    Article.find({ author })
      .populate("author")
      .exec((err, articles) => {
        if (err) next(err);
        return res.render("index", { articles });
      });
  } else {
    return res.redirect("/users/login");
  }
});

module.exports = router;
