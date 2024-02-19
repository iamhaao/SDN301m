const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authorSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  birthYear: {
    type: Number,
    default: 2023,
  },
});

const Author = mongoose.model("Author", authorSchema);

module.exports = Author;
