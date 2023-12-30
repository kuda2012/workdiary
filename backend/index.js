const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const { tokenIsCurrent } = require("./middleware/userMiddleware");
const ExpressError = require("./expressError");
const { rateLimit } = require("express-rate-limit");
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1, // limit each IP to 200 requests per windowMs
  message: "Too many requests from this IP, please try again later!",
  handler: (req, res, next, options) => {
    try {
      return next(new ExpressError(options.message, 429));
    } catch (error) {
      next(error);
    }
  },
});

// Apply the rate limiter to all requests
app.use(limiter);
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
const userRoutes = require("./routes/user-routes");
const postRoutes = require("./routes/post-routes");
const tabRoutes = require("./routes/tab-routes");
const tagRoutes = require("./routes/tag-routes");

app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/tabs", tabRoutes);
app.use("/tags", tagRoutes);

app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

/** Generic error handler. */

app.use(function (err, req, res, next) {
  if (err.stack) console.error(err.stack);
  return res.status(err.status || 500).send({
    message: err.message,
    err,
  });
});

module.exports = { app };
