const express = require("express");
const bodyParser = require("body-parser");
const Leader = require("../models/leaders");
var authenticate = require("../authenticate");
const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());
leaderRouter.all("/", (req, res, next) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  next();
});
leaderRouter.get("/", (req, res, next) => {
  Leader.find({})
    .then(
      (leaders) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(leaders);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});
leaderRouter.post(
  "/",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req, res, next) => {
    const newLeader = new Leader(req.body);
    newLeader
      .save()
      .then(
        (leader) => {
          console.log("Leader Created ", leader);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leader);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
);
leaderRouter.put(
  "/",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /leaders");
  }
);
leaderRouter.delete(
  "/",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req, res, next) => {
    Leader.deleteMany({})
      .then((res) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
      })
      .catch((err) => next(err));
  }
);
leaderRouter.get("/:leaderId", (req, res, next) => {
  console.log(req.params.leaderId);
  Leader.findById(req.params.leaderId)
    .then(
      (leader) => {
        if (leader !== null) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leader);
        } else {
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          res.end("leader: " + req.params.leaderId + " NOT FOUND");
        }
      },
      (err) => next(err)
    )
    .catch((err) => {
      next(err);
    });
});

leaderRouter.post(
  "/:leaderId",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /leaders/" + req.params.leaderId);
  }
);

leaderRouter.put(
  "/:leaderId",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req, res, next) => {
    Leader.findByIdAndUpdate(
      req.params.leaderId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (leader) => {
          if (leader !== null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(leader);
          } else {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.end("leader: " + req.params.leaderId + " NOT FOUND");
          }
        },
        (err) => next(err)
      )
      .catch((err) => {
        next(err);
      });
  }
);

leaderRouter.delete(
  "/:leaderId",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req, res, next) => {
    Leader.findByIdAndDelete(req.params.leaderId)
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }
);
module.exports = leaderRouter;
