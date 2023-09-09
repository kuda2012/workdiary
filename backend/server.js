const { PORT } = require("./config");
const { app } = require("./index.js");
app.listen(PORT, function () {
  console.log(`Server starting on port ${PORT}!`);
});
