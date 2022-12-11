const mongoose = require("mongoose");
const pizzaSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  img: {
    type: String,
  },
  price: {
    type: String,
  },
  size: {
    type: String,
  },
});
module.exports = mongoose.model("pizza", pizzaSchema);
