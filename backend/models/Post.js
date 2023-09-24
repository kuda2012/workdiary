const db = require("../db");

class Post {
  static async create(user_id, body) {
    const createdPost = await db.query(
      `INSERT INTO posts (user_id, date, summary_text)
       VALUES ($1, $2, $3) RETURNING *`,
      [user_id, body.date, body.summary_text]
    );
    return createdPost[0];
  }
  static async getPost(user_id, date) {
    const post = await db.query(
      `SELECT * FROM posts WHERE user_id = $1 AND DATE(date)=$2 `,
      [user_id, date]
    );
    return post[0];
  }
  static async update(body, post_id) {
    let queryText = "UPDATE posts SET";
    const queryValues = [];
    if (body.summary_text !== undefined) {
      queryText += " summary_text = $1,"; // Add the column to the query
      queryValues.push(body.summary_text); // Add the value to the parameter array
    }
    if (body.summary_voice !== undefined) {
      queryText += " summary_voice = $2,"; // Add the column to the query
      queryValues.push(body.summary_voice); // Add the value to the parameter array
    }
    queryText = queryText.slice(0, -1);
    queryValues.push(post_id);
    queryText += ` WHERE id = $${queryValues.length} RETURNING *`;
    const result = await db.query(queryText, queryValues);
    return result[0];
  }
  static async getOrCreatePostForDay(user_id, body) {
    const getPost = await db.query(
      `SELECT * FROM posts WHERE user_id = $1 AND DATE(date)=$2 `,
      [user_id, body.date]
    );
    console.log(getPost);
    if (!getPost[0]) {
      const createdPost = await this.create(user_id, body);
      return createdPost;
    }
    return getPost[0];
  }
}

module.exports = Post;
