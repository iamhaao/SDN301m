const express = require("express");
const bodyParser = require("body-parser");

const bookRouter = express.Router();

bookRouter.use(bodyParser.json());
bookRouter.all("/", (req, res, next) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  next();
});
bookRouter.get("/", (req, res, next) => {
  res.end("Will send all the books to you!");
});
bookRouter.post("/", (req, res, next) => {
  res.end(
    "Will add the book: " +
      req.body.title +
      " with details: " +
      req.body.description +
      " with publish_date:" +
      req.body.publish_date
  );
});
bookRouter.put("/", (req, res, next) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /books");
});
bookRouter.delete("/", (req, res, next) => {
  res.end("Deleting all books");
});
bookRouter.get("/:booksId", (req, res, next) => {
  res.end("Will send details of the book: " + req.params.booksId + " to you!");
});

bookRouter.post("/:booksId", (req, res, next) => {
  res.statusCode = 403;
  res.end("POST operation not supported on /books/" + req.params.booksId);
});

bookRouter.put("/:booksId", (req, res, next) => {
  res.write("Updating the book: " + req.params.booksId + "\n");
  res.end(
    "Will update the book: " +
      req.body.title +
      " with details: " +
      req.body.description +
      " with publish_date:" +
      req.body.publish_date
  );
});

bookRouter.delete("/:booksId", (req, res, next) => {
  res.end("Deleting book: " + req.params.booksId);
});
module.exports = bookRouter;
