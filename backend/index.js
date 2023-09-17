const express = require("express");
var cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const userRoutes = require("./routes/user-routes");
const postRoutes = require("./routes/post-routes");
const tabRoutes = require("./routes/tab-routes");

app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/tabs", tabRoutes);

module.exports = { app };
