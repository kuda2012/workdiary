const db = require("../db");
const pgp = require("pg-promise")();
const dbConnection = pgp("postgres://localhost/worksnap");

class Tag {
  static async create(post, body) {
    // const createdTabs = [];
    // for (let tag of body.tags) {
    //   const insertingTab = await db.query(
    //     `INSERT INTO tags (post_id, title, url, comment, tag_order)
    //    VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    //     [post.id, tag.title, tag.url, tag.comment, tag.tag_order]
    //   );
    //   createdTabs.push(insertingTab.rows[0]);
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
    return tags.rows;
  }
  // static async update(tag) {
  // let queryText = "UPDATE TABS SET";
  // const queryValues = [];
  // if (tag.title !== undefined) {
  //   queryText += " title = $1,"; // Add the column to the query
  //   queryValues.push(tag.title); // Add the value to the parameter array
  // }
  // if (tag.url !== undefined) {
  //   queryText += " url = $2,"; // Add the column to the query
  //   queryValues.push(tag.url); // Add the value to the parameter array
  // }
  // if (tag.comment !== undefined) {
  //   queryText += " comment = $3,"; // Add the column to the query
  //   queryValues.push(tag.comment); // Add the value to the parameter array
  // }
  // if (tag.tag_order !== undefined) {
  //   queryText += " tag_order = $4,"; // Add the column to the query
  //   queryValues.push(tag.tag_order); // Add the value to the parameter array
  // }
  // queryText = queryText.slice(0, -1);
  // queryValues.push(tag.tag_id);
  // queryText += ` WHERE id = $${queryValues.length} RETURNING *`;
  // const result = await db.query(queryText, queryValues);
  // return result.rows[0];
  // }

  static async bulkUpdate(tags, user_id, post_id, date) {
    const queryText = `
    UPDATE tags AS t
    SET
      title = u.title,
      url = u.url,
      comment = u.comment,
      tag_order = u.tag_order::integer
    FROM (VALUES 
      ${tags
        .map(
          (tag, index) =>
            `($${index * 5 + 1}, $${index * 5 + 2}, $${index * 5 + 3}, $${
              index * 5 + 4
            }, $${index * 5 + 5})`
        )
        .join(",")}
    ) AS u(tag_id, title, url, comment, tag_order)
    WHERE t.id = u.tag_id::integer AND t.post_id =${post_id}
    RETURNING t.*;
  `;
    const queryValues = tags.flatMap((tag) => [
      tag.tag_id,
      tag.title,
      tag.url,
      tag.comment,
      tag.tag_order,
    ]);
    await db.query(queryText, queryValues);
    return this.getTabs(user_id, date);
  }

  static async getOrCreatePostForDay(user_id, body) {
    const getPost = await db.query(
      `SELECT * FROM posts WHERE user_id = $1 AND DATE(date)=$2 `,
      [user_id, body.date]
    );
    if (!getPost.rows[0]) {
      const createdPost = await this.create(user_id, body);
      return createdPost;
    }
    return getPost.rows[0];
  }
}

module.exports = Tag;
