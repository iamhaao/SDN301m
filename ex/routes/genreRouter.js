const express = require("express");
const bodyParser = require("body-parser");

const genreRouter = express.Router();

const Genre = require("../models/genres");

genreRouter.use(bodyParser.json());
genreRouter.all("/", (req, res, next) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  next();
});
genreRouter.get("/", (req, res, next) => {
  Genre.find({})
    .then(
      (genres) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(genres);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});
genreRouter.post("/", (req, res, next) => {
  const newGenre = new Genre(req.body);
  newGenre
    .save()
    .then(
      (genre) => {
        console.log("gender Created ", genre);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(genre);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});
genreRouter.put("/", (req, res, next) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /genres");
});
genreRouter.delete("/", (req, res, next) => {
  Genre.deleteMany({})
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
genreRouter.get("/:genresId", (req, res, next) => {
  Genre.findById(req.params.genresId)
    .then(
      (genre) => {
        if (genre !== null) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(genre);
        } else {
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          res.end("Genre: " + req.params.genresId + " NOT FOUND");
        }
      },
      (err) => next(err)
    )
    .catch((err) => {
      next(err);
    });
});

genreRouter.post("/:genresId", (req, res, next) => {
  res.statusCode = 403;
  res.end("POST operation not supported on /genres/" + req.params.genresId);
});

genreRouter.put("/:genresId", (req, res, next) => {
  Genre.findByIdAndUpdate(
    req.params.genresId,
    {
      $set: req.body,
    },
    { new: true }
  )
    .then(
      (genre) => {
        if (genre !== null) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(genre);
        } else {
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          res.end("Genre: " + req.params.genresId + " NOT FOUND");
        }
      },
      (err) => next(err)
    )
    .catch((err) => {
      next(err);
    });
});

genreRouter.delete("/:genresId", (req, res, next) => {
  Genre.findByIdAndDelete(req.params.genresId)
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
module.exports = genreRouter;
