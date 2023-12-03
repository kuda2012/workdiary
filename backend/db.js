const { DB_URI } = require("./config");
const pgp = require("pg-promise")();
// const db = pgp(DB_URI);
const db = pgp(DB_URI.concat("?ssl=true"));

module.exports = db;
