const express = require("express");
const bodyParser = require("body-parser");

const authorRouter = express.Router();

authorRouter.use(bodyParser.json());
authorRouter.all("/", (req, res, next) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  next();
});
authorRouter.get("/", (req, res, next) => {
  res.end("Will send all the authors to you!");
});
authorRouter.post("/", (req, res, next) => {
  res.end(
    "Will add the author: " +
      req.body.id +
      " with name: " +
      req.body.name +
      " bod: " +
      req.body.bod +
      " country:" +
      req.body.country
  );
});
authorRouter.put("/", (req, res, next) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /authors");
});
authorRouter.delete("/", (req, res, next) => {
  res.end("Deleting all authors");
});
authorRouter.get("/:authorId", (req, res, next) => {
  res.end(
    "Will send details of the author: " + req.params.authorId + " to you!"
  );
});

authorRouter.post("/:authorId", (req, res, next) => {
  res.statusCode = 403;
  res.end("POST operation not supported on /authors/" + req.params.authorId);
});

authorRouter.put("/:authorId", (req, res, next) => {
  res.write("Updating the author: " + req.params.authorId + "\n");
  res.end(
    "Will update the author: " +
      req.body.id +
      " with name: " +
      req.body.name +
      " bod: " +
      req.body.bod +
      " country:" +
      req.body.country
  );
});

authorRouter.delete("/:authorId", (req, res, next) => {
  res.end("Deleting author: " + req.params.authorId);
});
module.exports = authorRouter;
