const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const userRoutes = require("./routes/user-routes");
const postRoutes = require("./routes/post-routes");
const tabRoutes = require("./routes/tab-routes");
const tagRoutes = require("./routes/tag-routes");

app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/tabs", tabRoutes);
app.use("/tags", tagRoutes);

module.exports = { app };
