const express = require("express");
const bodyParser = require("body-parser");

const genreRouter = express.Router();

genreRouter.use(bodyParser.json());
genreRouter.all("/", (req, res, next) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  next();
});
genreRouter.get("/", (req, res, next) => {
  res.end("Will send all the genres to you!");
});
genreRouter.post("/", (req, res, next) => {
  res.end(
    "Will add the genre: " + req.body.id + " with details: " + req.body.name
  );
});
genreRouter.put("/", (req, res, next) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /genres");
});
genreRouter.delete("/", (req, res, next) => {
  res.end("Deleting all genres");
});
genreRouter.get("/:genresId", (req, res, next) => {
  res.end(
    "Will send details of the genre: " + req.params.genresId + " to you!"
  );
});

genreRouter.post("/:genresId", (req, res, next) => {
  res.statusCode = 403;
  res.end("POST operation not supported on /genres/" + req.params.genresId);
});

genreRouter.put("/:genresId", (req, res, next) => {
  res.write("Updating the genre: " + req.params.genresId + "\n");
  res.end(
    "Will update the genre: " + req.body.id + " with details: " + req.body.name
  );
});

genreRouter.delete("/:genresId", (req, res, next) => {
  res.end("Deleting genre: " + req.params.genresId);
});
module.exports = genreRouter;
