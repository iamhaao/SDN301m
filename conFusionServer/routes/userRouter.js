const express = require("express");
const bodyParser = require("body-parser");
var User = require("../models/users");
var passport = require("passport");
var authenticate = require("../authenticate");
const router = express.Router();
router.use(bodyParser.json());

router.get(
  "/",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req, res) => {
    User.find({})
      .then(
        (users) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(users);
        },
        (err) => next(err)
      )
      .catch((error) => {
        next(err);
      });
  }
);
router.post("/signup", async (req, res, next) => {
  try {
    const newUser = await User.register(
      new User({ username: req.body.username }),
      req.body.password
    );

    if (req.body.firstname) newUser.firstname = req.body.firstname;
    if (req.body.lastname) newUser.lastname = req.body.lastname;

    await newUser.save();

    passport.authenticate("local")(req, res, () => {
      res
        .status(200)
        .json({ success: true, status: "Registration Successful!" });
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "User registration failed", details: err.message });
  }
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  var token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({
    success: true,
    token: token,
    status: "You are successfully logged in!",
  });
});

router.get("/logout", (req, res) => {
  console.log(req.session);
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    var err = new Error("You are not logged in!");
    err.status = 403;
    next(err);
  }
});
module.exports = router;
