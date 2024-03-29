var createError = require("http-errors");
var express = require("express");
var path = require("path");
var config = require("./config");
var cookieParser = require("cookie-parser");
var passport = require("passport");
var authenticate = require("./authenticate");
var logger = require("morgan");
var mongoose = require("mongoose");
const session = require("express-session");
var FileStore = require("session-file-store")(session);

var indexRouter = require("./routes/index");
var dishRouter = require("./routes/dishRouter");
var promoRouter = require("./routes/promotionRouter");
var leaderRouter = require("./routes/leaderRouter");
var usersRouter = require("./routes/userRouter");
var uploadRouter = require("./routes/uploadRouter");
var favoriteRouter = require("./routes/favoriteRouter");

const hostname = "localhost";
const port = 3000;
const url = config.mongoUrl;
const connect = mongoose.connect(url);
var app = express();

app.use(
  session({
    name: "session-id",
    secret: "12345-67890-09876-54321",
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
  })
);
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connect.then(
  (db) => {
    console.log("Connected correctly to server");
  },
  (err) => {
    console.log(err);
  }
);

app.use("/", indexRouter);
app.use("/users", usersRouter);

// function auth(req, res, next) {
//   console.log(req.user);

//   if (!req.user) {
//     var err = new Error("You are not authenticated!");
//     err.status = 403;
//     next(err);
//   } else {
//     next();
//   }
// }

// app.use(auth);
app.use(express.static(path.join(__dirname, "public")));
app.use("/dishes", dishRouter);
app.use("/promotions", promoRouter);
app.use("/leaders", leaderRouter);
app.use("/imageUpload", uploadRouter);
app.use("/favorites", favoriteRouter);

// // Secure traffic only
// app.all("*", (req, res, next) => {
//   if (req.secure) {
//     return next();
//   } else {
//     res.redirect(
//       307,
//       "https://" + req.hostname + ":" + app.get("secPort") + req.url
//     );
//   }
// });
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
module.exports = app;
