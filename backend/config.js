require("dotenv").config();
const PORT = process.env.PORT || 3000;

//Uncomment line below to set NODE_ENV to test
// let NODE_ENV = "test"

let DB_URI;
let BACKEND_URL;
if (process.env.NODE_ENV === "test") {
  DB_URI = "workdiary_test";
} else {
  DB_URI =
    process.env.DATABASE_URL?.concat("?ssl=true") ||
    "postgres://localhost/workdiary";
  BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";
}

const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD;

const CLIENT_ID = process.env.CLIENT_ID;

const GENERAL_SECRET_KEY = process.env.GENERAL_SECRET_KEY;

const VERIFY_ACCOUNT_SECRET_KEY = process.env.VERIFY_ACCOUNT_SECRET_KEY;

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

const ZOHO_EMAIL_PASSWORD = process.env.ZOHO_EMAIL_PASSWORD;

const BCRYPT_HASH_ROUNDS = 12;

console.log("Using database!", DB_URI);
module.exports = {
  PORT,
  DB_URI,
  CLIENT_ID,
  GMAIL_PASSWORD,
  BACKEND_URL,
  ENCRYPTION_KEY,
  BCRYPT_HASH_ROUNDS,
  GENERAL_SECRET_KEY,
  VERIFY_ACCOUNT_SECRET_KEY,
  DEEPGRAM_API_KEY,
  ZOHO_EMAIL_PASSWORD,
};
