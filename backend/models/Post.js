const db = require("../db");
const { v4: uuid } = require("uuid");

class Post {
  static async create(user_id, body, summary_voice) {
    /// add optional summary_voice
    const createdPost = await db.query(
      `INSERT INTO posts (user_id, date, summary_text, summary_voice)
       VALUES ($1, $2, $3, $4) RETURNING id, user_id, summary_text, date`,
      [user_id, body.date, body.summary_text, summary_voice]
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
  static async getSharedPost(pointerId) {
    const { post_id } = await db.oneOrNone(
      `SELECT post_id FROM shared_posts WHERE pointer_id = $1`,
      [pointerId]
    );
    return db.oneOrNone(
      `SELECT id, user_id, summary_text, date FROM posts where id=$1`,
      [post_id]
    );
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
  // static async getOrCreatePostForDay(user_id, body) {
  //   const getPost = await this.getPost(user_id, body.date);
  //   const createdPost = await this.create(user_id, body);
  //   if (!getPost) {
  //     return createdPost;
  //   }
  //   return getPost;
  // }

  // p.text_search @@ plainto_tsquery('english', $2) -- Search using ts_query
  // OR
  // tabs.text_search @@ plainto_tsquery('english', $2) -- Search using ts_query
  // OR
  static async search(user_id, query) {
    return db.query(
      `SELECT
    p.date,
    p.summary_text,
    tabs.url,
    tabs.title,
    tabs.comment,
    tags.text
FROM
    posts AS p
LEFT JOIN
    tags ON p.id = tags.post_id
LEFT JOIN
    tabs ON p.id = tabs.post_id
WHERE
    p.user_id = $1
    AND (
        tags.text ILIKE '%' || $2 || '%' -- Search tags by text
        OR
        p.text_search::text ILIKE '%' || $2 || '%'
        OR
        tabs.text_search::text ILIKE '%' || $2 || '%'
    );`,
      [user_id, query]
    );
  }
  static async generateShareLink(post_id) {
    return db.query(
      `INSERT INTO shared_posts (pointer_id, post_id)
       VALUES ($1, $2) RETURNING pointer_id, post_id`,
      [uuid(), post_id]
    );
  }
  static async deactivateShareLink(post_id) {
    return db.query(
      `DELETE FROM shared_posts
       WHERE post_id=$1`,
      [post_id]
    );
  }
}

module.exports = Post;
