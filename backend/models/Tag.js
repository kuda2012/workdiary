const db = require("../db");
const pgp = require("pg-promise")();

class Tag {
  static async create(post, body) {
    try {
      await db.tx(async (t) => {
        const insert = pgp.helpers.insert(
          { post_id: post.id, text: body.tag },
          ["post_id", "text"],
          "tags"
        );
        return t.manyOrNone(insert + " RETURNING *");
      });
      return this.getTags(post.user_id, body.date);
    } catch (error) {
      throw error;
    }
  }
  static async getTags(user_id, date) {
    const tags = await db.manyOrNone(
      `SELECT tags.id as tag_id, post_id, text FROM tags
      JOIN posts ON posts.id = tags.post_id
      WHERE posts.user_id = $1 AND DATE(date)=$2
      ORDER BY tag_id
      `,
      [user_id, date]
    );
    return tags;
  }

  static async delete(user_id, post_id, tag_id, date) {
    const tag = await db.oneOrNone(
      `SELECT * FROM tags
      WHERE post_id = $1 AND id = $2
      `,
      [post_id, tag_id]
    );
    if (tag) {
      await db.query(
        `DELETE FROM tags
      WHERE tags.post_id = $1 AND id = $2
      `,
        [post_id, tag_id]
      );
    }

    return this.getTags(user_id, date);
  }
}

module.exports = Tag;
