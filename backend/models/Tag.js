const db = require("../db");
const pgp = require("pg-promise")();

class Tag {
  static async create(post, body) {
    // const createdTabs = [];
    // for (let tag of body.tags) {
    //   const insertingTab = await db.query(
    //     `INSERT INTO tags (post_id, title, url, comment, tag_order)
    //    VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    //     [post.id, tag.title, tag.url, tag.comment, tag.tag_order]
    //   );
    //   createdTabs.push(insertingTab[0]);
    // }
    // return createdTabs;
    const tags = body.tags.map((tag) => ({
      post_id: post.id,
      text: tag.text,
    }));
    try {
      await db.tx(async (t) => {
        const insert = pgp.helpers.insert(tags, ["post_id", "text"], "tags");
        return t.manyOrNone(insert + " RETURNING *");
      });
      return this.getTags(post.user_id, body.date);
    } catch (error) {
      throw error;
    }
  }
  static async getTags(user_id, date) {
    const tags = await db.query(
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
