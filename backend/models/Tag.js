const db = require("../db");

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
      title: tag.title,
      url: tag.url,
      comment: tag.comment,
      tag_order: tag.tag_order,
    }));
    try {
      await dbConnection.tx(async (t) => {
        const insert = pgp.helpers.insert(
          tags,
          ["post_id", "title", "url", "comment", "tag_order"],
          "tags"
        );
        return t.manyOrNone(insert + " RETURNING *");
      });
      return this.getTabs(post.user_id, post.date);
    } catch (error) {
      throw error;
    }
  }
  static async getTabs(user_id, date) {
    const tags = await db.query(
      `SELECT tags.id as tag_id, post_id, title, url, comment, tag_order FROM tags
      JOIN posts ON posts.id = tags.post_id
      WHERE posts.user_id = $1 AND DATE(date)=$2
      ORDER BY tag_order
      `,
      [user_id, date]
    );
    return tags;
  }

  static async delete(post_id, tag_id) {
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

    return "You tag has been deleted";
  }
}

module.exports = Tag;
