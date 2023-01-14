var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var articleSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  likes: { type: Number, default: 0 },
  comments: [String],
  author: { type: String, required: true },
  slug: String,
});

articleSchema.pre("save", function (next) {
  if (this.title || this.isModified("title")) {
    this.slug = this.title.toLowerCase().split(" ").join("-");
    next();
  } else {
    next();
  }
});

module.exports = mongoose.model("Article", articleSchema);
