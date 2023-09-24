const db = require("../db");
const pgp = require("pg-promise")();
// const dbConnection = pgp("postgres://localhost/worksnap");

class Tab {
  static async create(post, body) {
    // const createdTabs = [];
    // for (let tab of body.tabs) {
    //   const insertingTab = await db.query(
    //     `INSERT INTO tabs (post_id, title, url, comment, tab_tab_order)
    //    VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    //     [post.id, tab.title, tab.url, tab.comment, tab.tab_tab_order]
    //   );
    //   createdTabs.push(insertingTab[0]);
    // }
    // return createdTabs;
    const tabs = body.tabs.map((tab) => ({
      post_id: post.id,
      title: tab.title,
      url: tab.url,
      comment: tab.comment,
      tab_order: tab.tab_order,
    }));
    try {
      await db.tx(async (t) => {
        const insert = pgp.helpers.insert(
          tabs,
          ["post_id", "title", "url", "comment", "tab_order"],
          "tabs"
        );
        return t.manyOrNone(insert + " RETURNING *");
      });
      return this.getTabs(post.user_id, post.date);
    } catch (error) {
      throw error;
    }
  }
  static async getTabs(user_id, date) {
    const tabs = await db.query(
      `SELECT tabs.id as tab_id, post_id, title, url, comment, tab_order FROM tabs
      JOIN posts ON posts.id = tabs.post_id
      WHERE posts.user_id = $1 AND DATE(date)=$2
      ORDER BY tab_order
      `,
      [user_id, date]
    );
    return tabs;
  }
  // static async update(tab) {
  // let queryText = "UPDATE TABS SET";
  // const queryValues = [];
  // if (tab.title !== undefined) {
  //   queryText += " title = $1,"; // Add the column to the query
  //   queryValues.push(tab.title); // Add the value to the parameter array
  // }
  // if (tab.url !== undefined) {
  //   queryText += " url = $2,"; // Add the column to the query
  //   queryValues.push(tab.url); // Add the value to the parameter array
  // }
  // if (tab.comment !== undefined) {
  //   queryText += " comment = $3,"; // Add the column to the query
  //   queryValues.push(tab.comment); // Add the value to the parameter array
  // }
  // if (tab.tab_order !== undefined) {
  //   queryText += " tab_order = $4,"; // Add the column to the query
  //   queryValues.push(tab.tab_order); // Add the value to the parameter array
  // }
  // queryText = queryText.slice(0, -1);
  // queryValues.push(tab.tab_id);
  // queryText += ` WHERE id = $${queryValues.length} RETURNING *`;
  // const result = await db.query(queryText, queryValues);
  // return result[0];
  // }
  static async delete(post_id, tab_id) {
    const tab = await db.oneOrNone(
      `SELECT * FROM tabs
      WHERE post_id = $1 AND id = $2
      `,
      [post_id, tab_id]
    );
    if (tab) {
      await db.query(
        `DELETE FROM tabs
      WHERE tabs.post_id = $1 AND id = $2
      `,
        [post_id, tab_id]
      );
    }

    return "You tab has been deleted";
  }

  static async bulkUpdate(tabs, user_id, post_id, date) {
    const queryText = `
    UPDATE tabs AS t
    SET
      title = u.title,
      url = u.url,
      comment = u.comment,
      tab_order = u.tab_order::integer
    FROM (VALUES 
      ${tabs
        .map(
          (tab, index) =>
            `($${index * 5 + 1}, $${index * 5 + 2}, $${index * 5 + 3}, $${
              index * 5 + 4
            }, $${index * 5 + 5})`
        )
        .join(",")}
    ) AS u(tab_id, title, url, comment, tab_order)
    WHERE t.id = u.tab_id::integer AND t.post_id =${post_id}
    RETURNING t.*;
  `;
    const queryValues = tabs.flatMap((tab) => [
      tab.tab_id,
      tab.title,
      tab.url,
      tab.comment,
      tab.tab_order,
    ]);
    await db.query(queryText, queryValues);
    return this.getTabs(user_id, date);
  }
}

module.exports = Tab;
