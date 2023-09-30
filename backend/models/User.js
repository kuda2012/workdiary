const db = require("../db");
class User {
  static async create(payload) {
    const getUser = await db.query(
      `INSERT INTO users (id, email, name)
       VALUES ($1, $2, $3) RETURNING id, email, name`,
      [payload.sub, payload.email, payload.name]
    );
    return getUser[0];
  }
  static async delete(user_id) {
    const getUser = await db.query(
      `DELETE FROM USERS
       WHERE id=$1`,
      [user_id]
    );
    return getUser;
  }
  static async getUser(id) {
    const getUser = await db.oneOrNone(`SELECT * FROM users WHERE id = $1`, [
      id,
    ]);
    return getUser;
  }
}

module.exports = User;
