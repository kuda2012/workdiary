const { db } = require("../db");
class TranscribeLog {
  static async create(user_id, transcription, duration) {
    const createdLog = await db.query(
      `INSERT INTO transcribe_log (user_id, transcription, duration)
       VALUES ($1, $2, $3) RETURNING *`,
      [user_id, transcription, duration]
    );
    return createdLog[0];
  }
  static async getLog(user_id) {
    const result = await db.query(
      `SELECT CAST(COUNT(*) OVER () AS INTEGER) AS count
        FROM transcribe_log
        WHERE user_id = $1 AND created_at > (CURRENT_TIMESTAMP - INTERVAL '1 day');
`,
      [user_id]
    );
    return result[0];
  }
}
module.exports = TranscribeLog;
