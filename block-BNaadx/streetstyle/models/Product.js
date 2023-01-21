var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    img_model: String,

    img_product: String,

    description: String,

    department: String,

    quantity: Number,

    manage_stock: Number,

    regular_price: {
      type: Number,
      required: true,
    },

    sale_price: Number,

    status: String,

    discount: Number,
  },

  {
    timestamps: true,
  }
);

productSchema.pre("save", function (next) {
  this.title = this.title.trim();
  this.description = this.description.trim();

  if (this.discount || this.isModified("discount")) {
    var discount =
      this.regular_price - (this.regular_price * this.discount) / 100;
    this.sale_price = Math.floor(discount);
    this.status = "discount";

    return next();
  } else {
    this.discount = null;
    this.status = null;
    return next();
  }
});

module.exports = mongoose.model("Product", productSchema);
