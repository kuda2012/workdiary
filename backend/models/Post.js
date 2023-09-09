const db = require("../db");

class User {
  static async create(user_id, body) {
    const createdPost = await db.query(
      `INSERT INTO posts (user_id, date, summary_text)
       VALUES ($1, $2, $3) RETURNING date, summary_text`,
      [user_id, body.date, body.summary_text]
    );
    return createdPost.rows[0];
  }
  static async getOrCreatePostForDay(user_id, body) {
    const getPost = await db.query(
      `SELECT * FROM posts WHERE user_id = $1 AND DATE(date)=$2 `,
      [user_id, body.date]
    );
    if (!getPost.rows) {
      const createdPost = await this.create(user_id, body);
      return createdPost.rows[0];
    }
    return getPost.rows[0];
  }
}

module.exports = User;
