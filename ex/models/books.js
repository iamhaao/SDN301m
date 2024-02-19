const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var commentSchema = new Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const bookShema = new Schema(
  {
    isbn: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    subTitle: {
      type: String,
      required: true,
    },
    publish_date: {
      type: Date,
      required: true,
    },
    publisher: {
      type: String,
      required: true,
    },
    pages: {
      type: Number,
      default: 0,
    },
    website: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: true,
    },
    comment: [commentSchema],
  },
  {
    timestamps: true,
  }
);

var Book = mongoose.model("Book", bookShema);

module.exports = Book;
