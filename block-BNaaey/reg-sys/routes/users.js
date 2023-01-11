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
  res.render("login");
});

router.post("/login", (req, res, next) => {
  var { email, password } = req.body;

  // user must provide both email and password
  if (!email || !password) {
    console.log("Please enter the correct email and password");
    return res.redirect("/users/login");
  }

  // Finding & verifying the email, do exist or not.

  User.findOne({ email }, (err, user) => {
    if (err) return next(err);

    // if user with this email doesnt exists.
    if (!user) {
      console.log("Invalid Email");
      return res.redirect("/users/login");
    }

    // If email exist
    // confirming the password

    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);

      // if password doesnt matches.
      if (!result) {
        console.log("Invalid Password");
        return res.redirect("/users/login");
      }
      // If password matches
      req.session.userId = user.id;
      console.log("Password Matches");
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
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    res.redirect("/users/login");
  });
});

module.exports = router;
