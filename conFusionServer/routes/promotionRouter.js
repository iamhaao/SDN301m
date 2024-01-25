const express = require("express");
const bodyParser = require("body-parser");
const Promotion = require("../models/promotions");

const promotionRouter = express.Router();
promotionRouter.use(bodyParser.json());
promotionRouter.all("/", (req, res, next) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  next();
});
promotionRouter.get("/", (req, res, next) => {
  Promotion.find({})
    .then(
      (promotions) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotions);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});
promotionRouter.post("/", (req, res, next) => {
  const newPromotion = new Promotion(req.body);
  newPromotion
    .save()
    .then((promotion) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(promotion);
    })
    .catch((err) => next(err));
});
promotionRouter.put("/", (req, res, next) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /promotions");
});
promotionRouter.delete("/", (req, res, next) => {
  Promotion.deleteMany({})
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
promotionRouter.get("/:promotionId", (req, res, next) => {
  Promotion.findById(req.params.promotionId)
    .then(
      (promotion) => {
        if (promotion !== null) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promotion);
        } else {
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          res.end("Promotion: " + req.params.promotionId + " NOT FOUND");
        }
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

promotionRouter.post("/:promotionId", (req, res, next) => {
  res.statusCode = 403;
  res.end(
    "POST operation not supported on /promotions/" + req.params.promotionId
  );
});

promotionRouter.put("/:promotionId", (req, res, next) => {
  Promotion.findByIdAndUpdate(
    req.params.promotionId,
    {
      $set: req.body,
    },
    { new: true }
  )
    .then(
      (promotion) => {
        if (promotion !== null) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promotion);
        } else {
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          res.end("Promotion: " + req.params.promotionId + " NOT FOUND");
        }
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

promotionRouter.delete("/:promotionId", (req, res, next) => {
  Promotion.findByIdAndDelete(req.params.promotionId)
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
module.exports = promotionRouter;
