const db = require("../db");
const { v4: uuid } = require("uuid");
const moment = require("moment");
const { formatSearchResults } = require("../helpers/formatSearchResults");

const ffmpeg = require("ffmpeg-static");
const { exec } = require("child_process");
const { promisify } = require("util");
class Post {
  static async create(user_id, body, summary_voice) {
    /// add optional summary_voice
    const createdPost = await db.query(
      `INSERT INTO posts (user_id, date, summary_text, summary_voice)
       VALUES ($1, $2, $3, $4) RETURNING id, user_id, summary_voice, summary_text, date`,
      [user_id, body.date, body.summary_text, summary_voice]
    );
    return {
      ...createdPost[0],
      summary_voice: createdPost[0]?.summary_voice?.toString("base64"),
      date: moment(createdPost[0].date).format("MM/DD/YYYY"),
    };
  }
  static async getPost(user_id, date) {
    const post = await db.oneOrNone(
      `SELECT id, user_id, summary_text, date, summary_voice FROM posts WHERE user_id = $1 AND DATE(date)=$2 `,
      [user_id, date]
    );
    return post
      ? {
          ...post,
          summary_voice: post?.summary_voice?.toString("base64"),
          date: moment(post.date).format("MM/DD/YYYY"),
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
  static async getSharedPost(pointerId) {
    const { post_id } = await db.oneOrNone(
      `SELECT post_id FROM shared_posts WHERE pointer_id = $1`,
      [pointerId]
    );
    return db.oneOrNone(
      `SELECT id, user_id, summary_text, summary_voice, date FROM posts where id=$1`,
      [post_id]
    );
  }
  static async delete(post_id) {
    const post = await db.query(`DELETE FROM posts WHERE id = $1`, [post_id]);
    return post;
  }
  static async updateAudioMetadata(buffer) {
    try {
      const fs = require("fs");
      const inputFilePath = "./temp_audio_input.opus"; // Assume the input is Opus
      const intermediateFilePath = "./temp_audio_intermediate.wav";
      const outputFilePath = "./temp_audio_output.wav";

      // Write the Opus audio data to an input file
      fs.writeFileSync(inputFilePath, buffer);

      // Use FFmpeg to convert Opus to PCM WAV
      const convertCommand = `${ffmpeg} -i ${inputFilePath} -c:a pcm_s16le ${intermediateFilePath}`;
      const asyncConvertExec = promisify(exec);
      await asyncConvertExec(convertCommand);

      // Use FFmpeg to update the audio duration metadata
      const metadataCommand = `${ffmpeg} -i ${intermediateFilePath} -c copy -y ${outputFilePath}`;
      const asyncMetadataExec = promisify(exec);
      await asyncMetadataExec(metadataCommand);

      // Read the updated audio file back into a buffer
      const updatedAudioFromFFmpeg = fs.readFileSync(outputFilePath);

      // Cleanup: Delete temporary input and intermediate files
      fs.unlinkSync(inputFilePath);
      fs.unlinkSync(intermediateFilePath);
      fs.unlinkSync(outputFilePath);

      return updatedAudioFromFFmpeg; // Return the updated audio buffer from FFmpeg
    } catch (error) {
      console.error("Error updating audio metadata:", error);
      throw error;
    }
  }

  static async update(post_id, body, newSummaryVoice, oldSummaryVoice) {
    let queryText = "UPDATE posts SET";
    const queryValues = [];
    if (body.summary_text !== undefined) {
      queryValues.push(body.summary_text); // Add the value to the parameter array
      queryText += ` summary_text = $${queryValues.length},`; // Add the column to the query
    }
    if (newSummaryVoice !== undefined) {
      if (oldSummaryVoice) {
        const existingSummaryVoice = Buffer.from(oldSummaryVoice, "base64");
        let updatedSummaryVoice = null;
        updatedSummaryVoice = Buffer.concat([
          existingSummaryVoice,
          newSummaryVoice,
        ]);
        const updatedAudioFromFFmpeg = await this.updateAudioMetadata(
          updatedSummaryVoice
        );
        updatedSummaryVoice = Buffer.concat([
          updatedSummaryVoice,
          updatedAudioFromFFmpeg,
        ]);
        queryValues.push(updatedSummaryVoice);
      } else {
        queryValues.push(newSummaryVoice);
      }
      // Add the value to the parameter array
      queryText += ` summary_voice = $${queryValues.length},`; // Add the column to the query
    }
    queryText = queryText.slice(0, -1);
    queryValues.push(post_id);
    queryText += ` WHERE id = $${queryValues.length} RETURNING id, user_id, summary_text, summary_voice,  date`;
    const result = await db.query(queryText, queryValues);
    return {
      ...result[0],
      summary_voice: result[0]?.summary_voice?.toString("base64"),
    };
  }

  static async search(user_id, query) {
    let searchResults = await db.query(
      `WITH RankedResults AS (
        SELECT
          p.date,
          p.summary_text,
          tabs.url,
          tabs.title,
          STRING_AGG(tags.text, ', ') AS tag,
          (CASE
            WHEN tags.text ILIKE '%' || $2 || '%' THEN 'tag'
            WHEN p.summary_text ILIKE '%' || $2 || '%' THEN 'summary_text'
            WHEN tabs.url ILIKE '%' || $2 || '%' THEN 'url'
            WHEN tabs.title ILIKE '%' || $2 || '%' THEN 'title'
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
        summary_text,
        url,
        title,
        tag,
        match_source
        FROM RankedResults
        WHERE rn = 1;
`,
      [user_id, query]
    );
    searchResults = formatSearchResults(searchResults, query);
    return searchResults;
  }
  static async generateShareLink(post_id) {
    return db.query(
      `INSERT INTO shared_posts (pointer_id, post_id)
       VALUES ($1, $2) RETURNING pointer_id, post_id`,
      [uuid(), post_id]
    );
  }
  static async deactivateShareLink(post_id) {
    return db.query(
      `DELETE FROM shared_posts
       WHERE post_id=$1`,
      [post_id]
    );
  }
}

module.exports = Post;
