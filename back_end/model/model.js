const mongoose = require("mongoose");

const transSchema = new mongoose.Schema({
  id: Number,
  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
  sold: Boolean,
  dateOfSale: Date,
});

const Trans = mongoose.model("Tran", transSchema);

module.exports = Trans;
