const db = require("../db");
const { v4: uuid } = require("uuid");
class User {
  static async create(payload) {
    const getUser = await db.query(
      `INSERT INTO users (id, email, name)
       VALUES ($1, $2, $3) RETURNING id, email, name`,
      [payload.sub, payload.email, payload.name]
    );
    return getUser[0];
  }
  static async getUser(google_id) {
    const getUser = await db.query(`SELECT * FROM users WHERE id = $1`, [
      google_id,
    ]);
    return getUser[0];
  }
}

module.exports = User;
