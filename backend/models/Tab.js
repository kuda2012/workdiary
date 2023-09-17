const db = require("../db");
const pgp = require("pg-promise")();
const dbConnection = pgp("postgres://localhost/worksnap");

class Tab {
  static async create(post, body) {
    // const createdTabs = [];
    // for (let tab of body.tabs) {
    //   const insertingTab = await db.query(
    //     `INSERT INTO tabs (post_id, title, url, comment, order)
    //    VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    //     [post.id, tab.title, tab.url, tab.comment, tab.order]
    //   );
    //   createdTabs.push(insertingTab.rows[0]);
    // }
    // return createdTabs;
    const tabs = body.tabs.map((tab) => ({
      post_id: post.id,
      title: tab.title,
      url: tab.url,
      comment: tab.comment,
      order: tab.order,
    }));
    console.log(tabs);

    try {
      const insertingTabs = await dbConnection.tx(async (t) => {
        const insert = pgp.helpers.insert(
          tabs,
          ["post_id", "title", "url", "comment", "order"],
          "tabs"
        );
        return t.manyOrNone(insert + " RETURNING *");
      });

      return insertingTabs;
    } catch (error) {
      throw error;
    }
  }
  static async getPost(user_id, date) {
    const post = await db.query(
      `SELECT * FROM tabs WHERE user_id = $1 AND DATE(date)=$2 `,
      [user_id, date]
    );
    return post.rows[0];
  }
  static async update(body) {
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
    queryValues.push(body.id);
    queryText += ` WHERE id = $${queryValues.length} RETURNING *`;
    const result = await db.query(queryText, queryValues);
    return result.rows[0];
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

module.exports = Tab;
