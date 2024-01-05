const { formatSearchResults } = require("../helpers/formatSearchResults");
const { db, knex } = require("../db");
const moment = require("moment");
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

  static async listAllPosts(user_id, currentPage = 1) {
    function shortenSummaryText(entry) {
      // Extract the first 7 full words

      const words = entry
        ?.replace(/<[^>]+>/g, "")
        ?.match(/\w+/g)
        ?.slice(0, 7);
      // Check if any words were found
      if (!words) {
        return ``;
      }

      // Join the words back together with spaces and wrap in a paragraph tag
      return `${
        words.length < 7 ? words.join(" ") : words.join(" ").concat("...")
      }`;
    }
    const pageSize = 10;
    const response = await knex("posts")
      .select("date", "summary_text as entry")
      .where("user_id", user_id)
      .orderBy("date", "desc")
      .paginate({
        perPage: pageSize,
        currentPage: Number(currentPage),
        isLengthAware: true,
      });

    const posts = response.data.map((post) => {
      return {
        date: post.date,
        entry: post.entry && shortenSummaryText(post.entry),
      };
    });

    return { posts, pagination: response.pagination };
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

  static async search(user_id, query, currentPage = 1) {
    const perPage = 10;
    let searchResults = await db.query(
      `WITH RankedResults AS (
    SELECT 
        *,
        ROW_NUMBER() OVER (PARTITION BY date, match_source ORDER BY date DESC) AS row_num
    FROM (
        SELECT 
            p.date,
            p.summary_text AS entry,
            NULL AS tab,
            NULL AS tab_title,
            NULL AS tag,
            'entry' AS match_source
        FROM posts AS p
        WHERE p.user_id = $1 AND p.summary_text ILIKE '%' || $2 || '%'

        UNION ALL

        SELECT 
            p.date,
            NULL AS entry,
            tabs.url AS tab,
            NULL AS tab_title,
            NULL AS tag,
            'tab' AS match_source  -- Indicate match on tabs.url
        FROM posts AS p
        LEFT JOIN tabs ON p.id = tabs.post_id
        WHERE p.user_id = $1 AND tabs.url ILIKE '%' || $2 || '%'

        UNION ALL

        SELECT 
            p.date,
            NULL AS entry,
            NULL AS tab,
            tabs.title AS tab_title,
            NULL AS tag,
            'tab_title' AS match_source
        FROM posts AS p
        LEFT JOIN tabs ON p.id = tabs.post_id
        WHERE p.user_id = $1 AND tabs.title ILIKE '%' || $2 || '%'

        UNION ALL

        SELECT 
            p.date,
            NULL AS entry,
            NULL AS tab,
            NULL AS tab_title,
            STRING_AGG(tags.text, ', ') AS tag,
            'tag' AS match_source
        FROM posts AS p
        LEFT JOIN tags ON p.id = tags.post_id
        WHERE p.user_id = $1 AND tags.text ILIKE '%' || $2 || '%'
        GROUP BY p.date, tags.post_id
    ) AS subquery
)

SELECT
    date,
    entry,
    tab,
    tab_title,
    tag,
    match_source,
    CEIL(ROUND(COUNT(*) OVER ()) / ${perPage}) AS total_pages
FROM RankedResults
WHERE match_source IN ('tab', 'tab_title', 'entry', 'tag')
ORDER BY date DESC
LIMIT ${perPage} OFFSET ((${currentPage} - 1) * ${perPage});

  `,
      [user_id, query, currentPage]
    );

    // WHERE
    // (match_source <> 'entry' OR row_num = 1)
    // OR (match_source = 'entry' AND row_num = 1)
    return {
      results: formatSearchResults(searchResults, query),
      pagination: {
        currentPage: Number(currentPage),
        lastPage: searchResults[0]?.total_pages,
      },
    };
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
