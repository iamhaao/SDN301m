const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const generSchema = new Schema(
  {
    id: {
      type: Number,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Genre = mongoose.model("Genre", generSchema);
module.exports = Genre;
