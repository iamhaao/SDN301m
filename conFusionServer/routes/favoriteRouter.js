const express = require("express");
const Favorite = require("../models/favorite");
const { verifyUser } = require("../authenticate");
const favoriteRouter = express.Router();

favoriteRouter.get("/", verifyUser, async (req, res, next) => {
  try {
    const favorites = await Favorite.findOne({ userId: req.user._id })
      .populate("userId")
      .populate("dishes");
    if (!favorites) {
      console.log("call");
      return res.status(400).json("You not have favorite dishes");
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(favorites);
  } catch (error) {
    next(error);
  }
});
favoriteRouter.post("/", verifyUser, async (req, res, next) => {
  try {
    const listDishes = req.body;
    const userId = req.user._id;
    const existingFavorite = await Favorite.findOne({
      userId: req.user._id,
    })
      .populate("userId")
      .populate("dishes");
    if (existingFavorite) {
      const existingDishIds = existingFavorite.dishes.map((dish) =>
        dish._id.toString()
      );
      const newDishes = listDishes.filter(
        (dish) => !existingDishIds.includes(dish._id)
      );
      if (newDishes.length === 0) {
        return res.status(400).json("All dishes added before");
      }

      existingFavorite.dishes.push(...newDishes);
      await existingFavorite.save();
      const favorites = await Favorite.find({ userId: req.user._id })
        .populate("userId")
        .populate("dishes");
      res.status(201).json(favorites);
    } else {
      const newFavorite = new Favorite({
        userId,
        dishes: listDishes.map((dish) => dish._id),
      });
      await newFavorite.save();
      const favorites = await Favorite.find({ userId: req.user._id })
        .populate("userId")
        .populate("dishes");
      res.status(201).json(favorites);
    }
  } catch (error) {
    next(error);
  }
});

favoriteRouter.delete("/", verifyUser, async (req, res, next) => {
  try {
    const favorite = await Favorite.findOne({ userId: req.user._id });
    if (favorite) {
      await favorite.deleteOne();
      res.status(200).json(`Deleted success favorite list of ${req.user._id}`);
    } else {
      res.status(400).json("You not have favorite dishes");
    }
  } catch (error) {
    next(error);
  }
});

favoriteRouter.post("/:dishId", verifyUser, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const dishId = req.params.dishId;
    const existingFavorite = await Favorite.findOne({
      userId: req.user._id,
    })
      .populate("userId")
      .populate("dishes");
    if (existingFavorite) {
      const existingDishIds = existingFavorite.dishes.map((dish) =>
        dish._id.toString()
      );
      const newDishes = existingDishIds.filter((dish) => dish === dishId);

      if (newDishes.length === 0) {
        existingFavorite.dishes.push(dishId);
        await existingFavorite.save();
        const favorites = await Favorite.find({ userId: req.user._id })
          .populate("userId")
          .populate("dishes");
        res.status(201).json(favorites);
      } else {
        return res.status(400).json("Dish added before");
      }
    } else {
      const newFavorite = new Favorite({
        userId,
        dishes: [dishId],
      });
      await newFavorite.save();
      const favorites = await Favorite.find({ userId: req.user._id })
        .populate("userId")
        .populate("dishes");
      res.status(201).json(favorites);
    }
  } catch (error) {
    next(error);
  }
});

favoriteRouter.delete("/:dishId", verifyUser, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const dishId = req.params.dishId;
    const existingFavorite = await Favorite.findOne({
      userId: req.user._id,
    })
      .populate("userId")
      .populate("dishes");
    if (existingFavorite) {
      const existingDishIds = existingFavorite.dishes.map((dish) =>
        dish._id.toString()
      );
      const newDishes = existingDishIds.filter((dish) => dish === dishId);

      if (newDishes.length !== 0) {
        existingFavorite.dishes.pull(dishId);
        await existingFavorite.save();
        res.status(201).json(`Deleted success DishId ${dishId}`);
      } else {
        return res.status(400).json("Dish not exist in favorite list");
      }
    } else {
      return res.status(400).json("You not have favorite list");
    }
  } catch (error) {
    next(error);
  }
});
module.exports = favoriteRouter;
