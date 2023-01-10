var express = require("express");
var router = express.Router();

var User = require("../models/user");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// login page
router.get("/login", (req, res, next) => {
  res.render("login");
});

// register page
router.get("/register", (req, res, next) => {
  res.render("register");
});

// Register a user
router.post("/register", (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    res.redirect("/users/login");
  });
});

module.exports = router;
