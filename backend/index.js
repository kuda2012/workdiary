const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const { tokenIsCurrent } = require("./middleware/userMiddleware");
const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
const postController = require("./controllers/post-controller");

const userRoutes = require("./routes/user-routes");
const postRoutes = require("./routes/post-routes");
const tabRoutes = require("./routes/tab-routes");
const tagRoutes = require("./routes/tag-routes");

app.get("/posts", tokenIsCurrent, postController.getPost);
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
