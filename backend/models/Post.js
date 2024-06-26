const { formatSearchResults } = require("../helpers/formatSearchResults");
const { db, knex } = require("../db");
const pgp = require("pg-promise")();
const moment = require("moment");
class Post {
  static async create(user_id, body, createdByAddingText) {
    let createdPost;
    if (createdByAddingText) {
      createdPost = await db.query(
        `INSERT INTO posts (user_id, date, summary_text, last_updated)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING id, user_id, summary_text, last_updated, date`,
        [user_id, body.date, body.summary_text]
      );
    } else {
      createdPost = await db.query(
        `INSERT INTO posts (user_id, date, summary_text)
       VALUES ($1, $2, $3) RETURNING id, user_id, summary_text, last_updated, date`,
        [user_id, body.date, body.summary_text]
      );
    }

    return {
      ...createdPost[0],
      last_updated: createdPost[0].last_updated,
      date: moment(createdPost[0].date).format("MM/DD/YYYY"),
    };
  }
  static async getPost(user_id, date) {
    const post = await db.oneOrNone(
      `SELECT id, user_id, summary_text, date, last_updated FROM posts WHERE user_id = $1 AND DATE(date)=$2 `,
      [user_id, date]
    );
    return post
      ? {
          ...post,
          date: moment(post.date).format("MM/DD/YYYY"),
          last_updated: post.last_updated,
        }
      : null;
  }

  static async deletePostIfEmpty(user_id, date) {
    const post = await db.query(
      `SELECT posts.id as post_id, summary_text, url, text as tags_text FROM posts
        LEFT JOIN TAGS
        ON posts.id = tags.post_id
        LEFT JOIN tabs
        ON posts.id = tabs.post_id
        WHERE user_id = $1 AND DATE(date)=$2`,
      [user_id, date]
    );
    if (
      post[0]?.post_id &&
      (post[0]?.summary_text || post[0]?.url || post[0]?.tags_text)
    ) {
      return false;
    } else if (post[0]?.post_id) {
      await this.delete(post[0]?.post_id);
      return true;
    }
    return false;
  }
  static async getAllPostDates(user_id) {
    const allPostDates = await db.query(
      `SELECT date FROM posts WHERE user_id = $1`,
      [user_id]
    );
    return allPostDates.map((date) => date.date);
  }

  static async listAllPosts(
    user_id,
    currentPage = 1,
    is_chronological = false
  ) {
    function shortenSummaryText(entry) {
      // 1. Remove HTML tags:
      const textWithoutTags = entry?.replace(/<[^>]+>/g, "");

      // 2. Extract the first 7 words or characters, including non-word characters:
      const wordsAndCharacters = textWithoutTags?.match(/\S+/g)?.slice(0, 7);

      // 3. Check for words or characters:
      if (!wordsAndCharacters) {
        return "";
      }

      // 4. Join the extracted words/characters with spaces and add "..." if needed:
      return `${
        wordsAndCharacters.length < 7
          ? wordsAndCharacters.join(" ")
          : wordsAndCharacters.join(" ").concat("...")
      }`;
    }
    const pageSize = 10;
    const response = await knex("posts")
      .select("date", "summary_text as entry")
      .where("user_id", user_id)
      .orderBy("date", is_chronological ? "asc" : "desc")
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
    return { posts, pagination: response.pagination, is_chronological };
  }

  static async delete(post_id) {
    const post = await db.query(`DELETE FROM posts WHERE id = $1`, [post_id]);
    return post;
  }

  static async multiDelete(user_id, dates) {
    const datesToDelete = dates.split(",");
    try {
      await db.tx(async (t) => {
        const deleteQuery = pgp.as.format(
          "DELETE FROM POSTS WHERE date IN ($1:csv) AND user_id=$2",
          [datesToDelete, user_id]
        );

        return t.none(deleteQuery);
      });

      // Return a success message or other response if needed
      return "Your post(s) have been deleted.";
    } catch (error) {
      throw error;
    }
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
    return {
      ...result[0],
      last_updated: result[0].last_updated,
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
