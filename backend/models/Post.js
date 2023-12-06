const db = require("../db");
const moment = require("moment");
const { formatSearchResults } = require("../helpers/formatSearchResults");
class Post {
  static async create(user_id, body) {
    const createdPost = await db.query(
      `INSERT INTO posts (user_id, date, summary_text)
       VALUES ($1, $2, $3) RETURNING id, user_id, summary_text, date`,
      [user_id, body.date, body.summary_text]
    );
    const now = moment();
    return {
      ...createdPost[0],
      last_updated: now.isSame(createdPost[0].last_updated, "day")
        ? `Today at ${moment(createdPost[0].last_updated).format("h:mm A")}`
        : moment(createdPost[0].last_updated).format("MM/DD/YY - h:mm A"),
      date: moment(createdPost[0].date).format("MM/DD/YYYY"),
    };
  }
  static async getPost(user_id, date) {
    const post = await db.oneOrNone(
      `SELECT id, user_id, summary_text, date, last_updated FROM posts WHERE user_id = $1 AND DATE(date)=$2 `,
      [user_id, date]
    );
    const now = moment();
    return post
      ? {
          ...post,
          date: moment(post.date).format("MM/DD/YYYY"),
          // last_updated: `Today at ${moment(post.created_at).format("h:mm A")}`,
          last_updated: now.isSame(post.last_updated, "day")
            ? `Today at ${moment(post.last_updated).format("h:mm A")}`
            : moment(post.last_updated).format("MM/DD/YY - h:mm A"),
        }
      : null;
  }
  static async getAllPostDates(user_id) {
    const allPostDates = await db.query(
      `SELECT date FROM posts WHERE user_id = $1`,
      [user_id]
    );
    return allPostDates.map((date) => date.date);
  }

  static async delete(post_id) {
    const post = await db.query(`DELETE FROM posts WHERE id = $1`, [post_id]);
    return post;
  }

  static async update(post_id, body) {
    let queryText = "UPDATE posts SET";
    const queryValues = [];
    if (body.summary_text !== undefined) {
      queryValues.push(body.summary_text); // Add the value to the parameter array
      queryText += ` summary_text = $${queryValues.length},`; // Add the column to the query
    }
    queryText += ` last_updated = CURRENT_TIMESTAMP`;
    queryValues.push(post_id);
    queryText += ` WHERE id = $${queryValues.length} RETURNING id, user_id, last_updated, summary_text, date`;
    const result = await db.query(queryText, queryValues);
    const now = moment();
    return {
      ...result[0],
      last_updated: now.isSame(result[0].last_updated, "day")
        ? `Today at ${moment(result[0].last_updated).format("h:mm A")}`
        : moment(result[0].last_updated).format("MM/DD/YY"),
      // last_updated: now.isSame(result[0].last_updated, "day")
      //   ? moment(result[0].last_updated).format("MM/DD/YY")
      //   : moment(result[0].last_updated).format("MM/DD/YY"),
    };
  }

  static async search(user_id, query) {
    let searchResults = await db.query(
      `WITH RankedResults AS (
    SELECT
        p.date,
        p.summary_text as note,
        tabs.url as tab,
        tabs.title as tab_title,
        STRING_AGG(tags.text, ', ') AS tag,
        (CASE
            WHEN tags.text ILIKE '%' || $2 || '%' THEN 'tag'
            WHEN p.summary_text ILIKE '%' || $2 || '%' THEN 'note'
            WHEN tabs.url ILIKE '%' || $2 || '%' THEN 'tab'
            WHEN tabs.title ILIKE '%' || $2 || '%' THEN 'tab_title'
            ELSE 'no_match'
        END) AS match_source,
        ROW_NUMBER() OVER (PARTITION BY p.date ORDER BY p.date) AS rn
    FROM
        posts AS p
    LEFT JOIN
        tags ON p.id = tags.post_id
    LEFT JOIN
        tabs ON p.id = tabs.post_id
    WHERE
        p.user_id = $1
        AND (
            tags.text ILIKE '%' || $2 || '%'
            OR
            p.summary_text ILIKE '%' || $2 || '%'
            OR
            tabs.url ILIKE '%' || $2 || '%'
            OR
            tabs.title ILIKE '%' || $2 || '%'
        )
    GROUP BY
        p.date, p.summary_text, tabs.url, tabs.title, match_source
)
SELECT
    date,
    note,
    tab,
    tab_title,
    tag,
    match_source
FROM RankedResults
WHERE rn = 1;
`,

      [user_id, query]
    );
    return formatSearchResults(searchResults, query);
  }
  // static async getSharedPost(pointerId) {
  //   const { post_id } = await db.oneOrNone(
  //     `SELECT post_id FROM shared_posts WHERE pointer_id = $1`,
  //     [pointerId]
  //   );
  //   return db.oneOrNone(
  //     `SELECT id, user_id, summary_text, date FROM posts where id=$1`,
  //     [post_id]
  //   );
  // }
  // static async generateShareLink(post_id) {
  //   return db.query(
  //     `INSERT INTO shared_posts (pointer_id, post_id)
  //      VALUES ($1, $2) RETURNING pointer_id, post_id`,
  //     [uuid(), post_id]
  //   );
  // }
  // static async deactivateShareLink(post_id) {
  //   return db.query(
  //     `DELETE FROM shared_posts
  //      WHERE post_id=$1`,
  //     [post_id]
  //   );
  // }
}

module.exports = Post;
