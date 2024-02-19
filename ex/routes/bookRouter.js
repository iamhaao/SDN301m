const express = require("express");
const bodyParser = require("body-parser");

const Book = require("../models/books");
const bookRouter = express.Router();

bookRouter.use(bodyParser.json());
bookRouter.all("/", (req, res, next) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  next();
});
bookRouter.get("/", (req, res, next) => {
  Book.find({})
    .then(
      (books) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(books);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});
bookRouter.post("/", (req, res, next) => {
  const newBook = new Book(req.body);
  newBook
    .save()
    .then(
      (book) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(book);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});
bookRouter.put("/", (req, res, next) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /books");
});
bookRouter.delete("/", (req, res, next) => {
  Book.deleteMany({})
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
bookRouter.get("/:booksId", (req, res, next) => {
  Book.findById(req.params.booksId)
    .then(
      (book) => {
        if (book) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(book);
        } else {
          err = new Error("Book " + req.params.booksId + " not found");
          err.status = 404;
          return next(err);
        }
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

bookRouter.post("/:booksId", (req, res, next) => {
  res.statusCode = 403;
  res.end("POST operation not supported on /books/" + req.params.booksId);
});

bookRouter.put("/:booksId", (req, res, next) => {
  Book.findByIdAndUpdate(req.params.booksId, { $set: req.body }, { new: true })
    .then(
      (book) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(book);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

bookRouter.delete("/:booksId", (req, res, next) => {
  Book.findByIdAndDelete(req.params.booksId)
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
bookRouter
  .route("/:booksId/comments")
  .get((req, res, next) => {
    Book.findById(req.params.booksId)
      .then(
        (book) => {
          if (book != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(book.comment);
          } else {
            err = new Error("Book " + req.params.booksId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Book.findById(req.params.booksId)
      .then(
        (book) => {
          if (book != null) {
            book.comment.push(req.body);
            book.save().then(
              (book) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(book);
              },
              (err) => next(err)
            );
          } else {
            err = new Error("Book " + req.params.booksId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end(
      "PUT operation not supported on /books/" +
        req.params.booksId +
        "/comments"
    );
  })
  .delete((req, res, next) => {
    Book.findById(req.params.booksId)
      .then(
        (book) => {
          if (book != null) {
            for (var i = book.comment.length - 1; i >= 0; i--) {
              book.comment.id(book.comment[i]._id).deleteOne();
            }
            book.save().then(
              (book) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.send("Deleted commentId: " + req.params.comment);
              },
              (err) => next(err)
            );
          } else {
            err = new Error("book " + req.params.booksId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

bookRouter
  .route("/:bookId/comments/:commentId")
  .get((req, res, next) => {
    Book.findById(req.params.bookId)
      .then(
        (book) => {
          if (book != null && book.comment.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(book.comment.id(req.params.commentId));
          } else if (book == null) {
            err = new Error("Book " + req.params.bookId + " not found");
            err.status = 404;
            return next(err);
          } else {
            err = new Error("Comment " + req.params.commentId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end(
      "POST operation not supported on /books/" +
        req.params.bookId +
        "/comments/" +
        req.params.commentId
    );
  })
  .put((req, res, next) => {
    Book.findById(req.params.bookId)
      .then(
        (book) => {
          if (book != null && book.comment.id(req.params.commentId) != null) {
            if (req.body.rating) {
              book.comment.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
              book.comment.id(req.params.commentId).comment = req.body.comment;
            }
            book.save().then(
              (book) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(book);
              },
              (err) => next(err)
            );
          } else if (book == null) {
            err = new Error("book " + req.params.bookId + " not found");
            err.status = 404;
            return next(err);
          } else {
            err = new Error("Comment " + req.params.commentId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Book.findById(req.params.bookId)
      .then(
        (book) => {
          if (book != null && book.comment.id(req.params.commentId) != null) {
            book.comment.id(req.params.commentId).deleteOne();
            book.save().then(
              (book) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(book);
              },
              (err) => next(err)
            );
          } else if (book == null) {
            err = new Error("Book " + req.params.bookId + " not found");
            err.status = 404;
            return next(err);
          } else {
            err = new Error("Comment " + req.params.commentId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });
module.exports = bookRouter;
