const express = require("express");
var cors = require("cors");
const app = express();
app.use(cors());
const { PORT } = require("./config");
app.use(express.json());



const userRoutes = require("./routes/user-routes");
app.use("/users", userRoutes);

app.listen(PORT, function () {
  console.log(`Server starting on port ${PORT}!`);
});

module.exports = { app };
