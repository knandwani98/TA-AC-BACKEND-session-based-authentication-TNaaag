var express = require("express");
var router = express.Router();

var User = require("../models/user");

router.get("/", (req, res, next) => {
  console.log(req.session);
  var user = req.flash("user")[0];
  return res.render("users", { user });
});

// login page
router.get("/login", (req, res, next) => {
  var flash = req.flash("flash")[0];
  console.log(flash, " - flash errors");
  res.render("login", { flash });
});

// register form page
router.get("/register", function (req, res, next) {
  res.render("register");
});

// register user
router.post("/register", (req, res, next) => {
  // creating user
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    req.flash("flash", "User created successfully");
    res.redirect("/users/login");
  });
});

// confirming n loging in user
router.post("/login", (req, res, next) => {
  var { email, password } = req.body;
  // when input is empty
  if (!email || !password) {
    req.flash("flash", "Please enter email and password");
    return res.redirect("/users/login");
  }

  // finding and verifying user
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);

    // if user not found
    if (!user) {
      req.flash("flash", "please enter a correct email");
      return res.redirect("/users/login");
    }

    // veifying password
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);

      if (!result) {
        req.flash("flash", "please enter a valid password");
        return res.redirect("/users/login");
      }

      // if password matches
      req.session.userId = user.id;
      req.flash("user", user);
      return res.redirect("/users");
    });
  });
});

module.exports = router;
