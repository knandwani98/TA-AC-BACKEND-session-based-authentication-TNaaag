var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

var Schmea = mongoose.Schema;
var userSchema = new Schmea({
  firstname: {
    type: String,
    required: true,
  },

  lastname: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  city: String,
});

userSchema.pre("save", function (next) {
  if (this.password || this.isModified("password")) {
    bcrypt.hash(this.password, 10, (err, hashed) => {
      if (err) return next(err);
      this.password = hashed;
      next();
    });
  } else {
    next();
  }
});

userSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  });
};

userSchema.methods.fullName = function () {
  var result = this.firstname + " " + this.lastname;
  return result;
};

module.exports = mongoose.model("User", userSchema);
