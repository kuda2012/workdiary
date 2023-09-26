const db = require("../db");

class Post {
  static async create(user_id, body, summary_voice) {
    /// add optional summary_voice
    const createdPost = await db.query(
      `INSERT INTO posts (user_id, date, summary_text)
       VALUES ($1, $2, $3) RETURNING id, user_id, summary_text, date`,
      [user_id, body.date, body.summary_text]
    );
    return createdPost[0];
  }
  static async getPost(user_id, date) {
    const post = await db.oneOrNone(
      `SELECT id, user_id, summary_text, date FROM posts WHERE user_id = $1 AND DATE(date)=$2 `,
      [user_id, date]
    );
    return post;
  }
  static async delete(post_id) {
    const post = await db.query(`DELETE FROM posts WHERE id = $1`, [post_id]);
    return post;
  }
  static async update(post_id, body, summary_voice) {
    let queryText = "UPDATE posts SET";
    const queryValues = [];
    if (body.summary_text !== undefined) {
      queryValues.push(body.summary_text); // Add the value to the parameter array
      queryText += ` summary_text = $${queryValues.length},`; // Add the column to the query
    }
    if (summary_voice !== undefined) {
      queryValues.push(summary_voice); // Add the value to the parameter array
      queryText += ` summary_voice = $${queryValues.length},`; // Add the column to the query
    }
    queryText = queryText.slice(0, -1);
    queryValues.push(post_id);
    queryText += ` WHERE id = $${queryValues.length} RETURNING id, user_id, summary_text, date`;
    const result = await db.query(queryText, queryValues);
    return result[0];
  }
  static async getOrCreatePostForDay(user_id, body) {
    const getPost = await this.getPost(user_id, body.date);
    if (!getPost) {
      const createdPost = await this.create(user_id, body);
      return createdPost;
    }
    return getPost;
  }
}

module.exports = Post;
