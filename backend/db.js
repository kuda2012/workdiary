const { DB_URI } = require("./config");
const pgp = require("pg-promise")();
const db = pgp(DB_URI);

const knex = require("knex")({
  client: "pg",
  connection: {
    connectionString: DB_URI,
  },
});
const { attachPaginate } = require("knex-paginate");
attachPaginate();

module.exports = { db, knex };
