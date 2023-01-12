var express = require("express");
var router = express.Router();

var User = require("../models/user");

/* GET users listing. */
router.get("/", function (req, res, next) {
  console.log(req.session);
  res.render("user");
});

// login page
router.get("/login", (req, res, next) => {
  var err = req.flash("err")[0];
  res.render("login", { err });
});

router.post("/login", (req, res, next) => {
  var { email, password } = req.body;

  // user must provide both email and password
  if (!email || !password) {
    req.flash("err", "Please enter the email and password");
    return res.redirect("/users/login");
  }

  // Finding & verifying the email, do exist or not.

  User.findOne({ email }, (err, user) => {
    if (err) return next(err);

    // if user with this email doesnt exists.
    if (!user) {
      req.flash("err", "Please enter the valid email");
      return res.redirect("/users/login");
    }

    // If email exist
    // confirming the password

    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);

      // if password doesnt matches.
      if (!result) {
        req.flash("err", "Please type the correct password");
        return res.redirect("/users/login");
      }
      // If password matches
      req.session.userId = user.id;
      req.flash("success", "Login Successful");
      res.redirect("/users");
    });
  });
});

// register page
router.get("/register", (req, res, next) => {
  res.render("register");
});

// Register a user
router.post("/register", (req, res, next) => {
  var { email, password } = req.body;
  if (!email) {
    res.flash("emailErr", "email already exist");
    return res.redirect("/users/register");
  }
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    res.redirect("/users/login");
  });
});

// logout
router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.redirect("/users/login");
});

module.exports = router;
