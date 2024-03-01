const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const ExpressError = require("./expressError");
const { rateLimit } = require("express-rate-limit");
const { jobsTokenIsCurrent } = require("./middleware/userMiddleware");
const { deleteUnverifiedUsers24hrs } = require("./helpers/databaseJobs");
const { decodeJwt } = require("./helpers/decodeJwt");
const app = express();
app.set("trust proxy", 1);
app.get("/ip", (request, response) => response.send(request.ip));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 8, // limit each IP to 200 requests per windowMs
  message: "Too many requests from this IP.",
  keyGenerator: function (req) {
    const { id } = decodeJwt(req.headers.authorization);
    if (id) {
      return id;
    } else {
      req.ip;
    }
  },
  handler: (req, res, next, options) => {
    try {
      const { id, name, email } = decodeJwt(req.headers.authorization);
      console.log(
        `User rate limited: General App, Endpoint: ${
          req.path
        }, User ID: ${id}, Name: ${name}, Email: ${email}, IP address: ${
          req.ip
        }, Device: ${req.headers["user-agent"]}, Time: ${moment().format(
          "DD-MM-YYY HH:mm:ss"
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
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
const userRoutes = require("./routes/user-routes");
const postRoutes = require("./routes/post-routes");
const tabRoutes = require("./routes/tab-routes");
const tagRoutes = require("./routes/tag-routes");

app.use((req, res, next) => {
  // Get the IP address from the request object
  const ip = req.ip;
  const device = req.headers["user-agent"];

  // Log the IP address
  console.log(`Request from IP: ${ip}, Device: ${device}`);

  // Pass the request to the next middleware
  next();
});

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
