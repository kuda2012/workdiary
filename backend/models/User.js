const db = require("../db");
const { v4: uuid } = require("uuid");
class User {
  static async create(payload) {
    const getUser = await db.query(
      `INSERT INTO users (id, google_id, email, name)
       VALUES ($1, $2, $3, $4) RETURNING id, google_id, email, name`,
      [uuid(), payload.sub, payload.email, payload.name]
    );
    return getUser.rows[0];
  }
  static async getUser(google_id) {
    const getUser = await db.query(`SELECT * FROM users WHERE google_id = $1`, [
      google_id,
    ]);
    return getUser.rows[0];
  }
}

module.exports = User;
