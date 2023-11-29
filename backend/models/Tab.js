const db = require("../db");
const pgp = require("pg-promise")();
// const dbConnection = pgp("postgres://localhost/worksnap");

class Tab {
  static async create(post, body) {
    const tabs = body.tabs.map((tab) => ({
      post_id: post.id,
      title: tab.title,
      url: tab.url,
      comment: tab.comment,
      tab_order: tab.tab_order,
      icon: tab.icon,
      screenshot: tab.screenshot,
    }));
    try {
      await db.tx(async (t) => {
        const insert = pgp.helpers.insert(
          tabs,
          [
            "post_id",
            "title",
            "url",
            "comment",
            "tab_order",
            "icon",
            "screenshot",
          ],
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
    const tabs = await db.manyOrNone(
      `SELECT tabs.id as tab_id, post_id, title, url, comment, icon, tab_order FROM tabs
      JOIN posts ON posts.id = tabs.post_id
      WHERE posts.user_id = $1 AND DATE(date)=$2
      ORDER BY tab_order
      `,
      [user_id, date]
    );
    return tabs;
  }

  static async delete(user_id, post_id, tab_id, date) {
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

    return this.getTabs(user_id, date);
  }
  static async bulkDelete(post, tab_ids) {
    const tabIdsToDelete = tab_ids.split(",").map(Number);

    try {
      await db.tx(async (t) => {
        const deleteQuery = pgp.as.format(
          "DELETE FROM tabs WHERE id IN ($1:csv)",
          [tabIdsToDelete]
        );

        return t.none(deleteQuery);
      });

      // Return a success message or other response if needed
      return this.getTabs(post.user_id, post.date);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Tab;
