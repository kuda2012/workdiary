const express = require("express");
const moment = require("moment");
var cors = require("cors");
const bodyParser = require("body-parser");
const ExpressError = require("./expressError");
const { rateLimit } = require("express-rate-limit");
const { jobsTokenIsCurrent } = require("./middleware/userMiddleware");
const { deleteUnverifiedUsers24hrs } = require("./helpers/databaseJobs");
const { decodeJwt } = require("./helpers/decodeJwt");
const app = express();
app.use(cors());
app.set("trust proxy", 1);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 200 requests per windowMs
  message: "Too many requests from this IP.",
  keyGenerator: function (req) {
    const user = decodeJwt(req.headers.authorization);
    if (user?.id) {
      return user?.id;
    } else {
      req.ip;
    }
  },
  handler: (req, res, next, options) => {
    try {
      const user = decodeJwt(req.headers.authorization);
      console.log(
        `User rate limited: General App, Endpoint: ${req.path}, User ID: ${
          user?.id
        }, Full name: ${user?.full_name}, Email: ${user?.email}, IP address: ${
          req.ip
        }, Device: ${req.headers["user-agent"]}, Time: ${moment().format(
          "DD-MM-YYYY HH:mm:ss"
        )} `
      );
      return next(new ExpressError(options.message, 429));
    } catch (error) {
      next(error);
    }
  },
});

// Apply the rate limiter to all requests
app.use(limiter);
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
app.post("/jobs", jobsTokenIsCurrent, async (req, res, next) => {
  const response = await deleteUnverifiedUsers24hrs();
  res.status(200).send(response);
});

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
