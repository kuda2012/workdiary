require("dotenv").config();
const PORT = process.env.PORT || 3000;

//Uncomment line below to set NODE_ENV to test
// let NODE_ENV = "test"

let DB_URI;
if (process.env.NODE_ENV === "test") {
  DB_URI = "worksnap_test";
} else {
  DB_URI = process.env.DATABASE_URL || "postgres://localhost/worksnap";
}

const CLIENT_ID = process.env.CLIENT_ID;

const SECRET_KEY = process.env.SECRET_KEY;

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

console.log("Using database", DB_URI);
module.exports = {
  PORT,
  DB_URI,
  CLIENT_ID,
  SECRET_KEY,
  DEEPGRAM_API_KEY,
};
