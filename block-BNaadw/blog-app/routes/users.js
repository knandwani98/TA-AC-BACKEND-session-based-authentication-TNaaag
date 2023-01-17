var express = require("express");
const { connect } = require("mongoose");
var router = express.Router();

var User = require("../models/User");

//  USER ROUTE
router.get("/", function (req, res, next) {
  res.redirect("/");
});

// LOGIN FORM PAGE
router.get("/login", function (req, res, next) {
  // restritions
  if (req.session.user && req.cookies["connect.sid"]) {
    return res.redirect("/");
  }

  var flash = req.flash("flash");
  res.render("login", { flash });
});

// NEW USER PAGE
router.get("/new", (req, res, next) => {
  // restritions
  if (req.session.user && req.cookies["connect.sid"]) {
    return res.redirect("/");
  }

  res.render("signup");
});

// CREATING NEW USER
router.post("/new", (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    req.flash("flash", "User created successfully");
    return res.redirect("/users/login");
  });
});

// USER LOGGING IN
router.post("/login", (req, res, next) => {
  var { email, password } = req.body;

  // BLANK INPUT
  if (!email || !password) {
    req.flash("flash", "please insert email and password");
    return res.redirect("/users/login");
  }

  // CHECKING USER
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);

    //USER NOT FOUND
    if (!user) {
      req.flash("flash", "Please enter valid email");
      return res.redirect("/users/login");
    }

    //USER FOUND
    // &
    // VERIFYING PASSWORD

    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);

      // INVALID
      if (!result) {
        req.flash("flash", "Invalid password");
        return res.redirect("/users/login");
      }

      // PASSWORD MATCHES
      // CREATING SESSION
      req.session.user = user;

      console.log(req.session.user, " - session created");
      return res.redirect("/");
    });
  });
});

// LOG OUT USER
router.get("/logout", (req, res) => {
  req.flash("flash", "Logged Out");
  res.clearCookie("connect.sid");
  return res.redirect("/users/login");
});

module.exports = router;
