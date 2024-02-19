const express = require("express");
const bodyParser = require("body-parser");

const authorRouter = express.Router();

const Author = require("../models/authors");

authorRouter.use(bodyParser.json());
authorRouter.all("/", (req, res, next) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  next();
});
authorRouter.get("/", (req, res, next) => {
  Author.find({})
    .then(
      (authors) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(authors);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});
authorRouter.post("/", (req, res, next) => {
  const newAuthor = new Author(req.body);
  newAuthor
    .save()
    .then(
      (author) => {
        console.log("author Created ", author);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(author);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});
authorRouter.put("/", (req, res, next) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /authors");
});
authorRouter.delete("/", (req, res, next) => {
  Author.deleteMany({})
    .then(
      (resp) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});
authorRouter.get("/:authorId", (req, res, next) => {
  Author.findById(req.params.authorId)
    .then(
      (author) => {
        if (author !== null) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(author);
        } else {
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          res.end("Author: " + req.params.authorId + " NOT FOUND");
        }
      },
      (err) => next(err)
    )
    .catch((err) => {
      next(err);
    });
});

authorRouter.post("/:authorId", (req, res, next) => {
  res.statusCode = 403;
  res.end("POST operation not supported on /authors/" + req.params.authorId);
});

authorRouter.put("/:authorId", (req, res, next) => {
  Author.findByIdAndUpdate(
    req.params.authorId,
    {
      $set: req.body,
    },
    { new: true }
  )
    .then(
      (author) => {
        if (author !== null) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(author);
        } else {
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          res.end("Author: " + req.params.authorId + " NOT FOUND");
        }
      },
      (err) => next(err)
    )
    .catch((err) => {
      next(err);
    });
});

authorRouter.delete("/:authorId", (req, res, next) => {
  Author.findByIdAndDelete(req.params.authorId)
    .then(
      (resp) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});
module.exports = authorRouter;
