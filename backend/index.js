const express = require("express");
var cors = require("cors");
const app = express();
app.use(cors());
const { PORT } = require("./config");
app.use(express.json());

const userRoutes = require("./routes/user-routes");
app.use("/users", userRoutes);

module.exports = { app };
