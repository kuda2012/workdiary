const db = require("../db");
class TranscribeLog {
  static async create(user_id) {
    const getTranscribeLog = await db.query(
      `INSERT INTO transcribe_log (user_id)
       VALUES ($1) RETURNING *`,
      [user_id]
    );
    return getTranscribeLog[0];
  }
  static async log(user_id) {
    const getLog = await db.oneOrNone(
      `SELECT * from transcribe_log
        WHERE user_id=$1 AND date > (CURRENT_TIMESTAMP - INTERVAL '1 day')`,
      [user_id]
    );
    let log;
    if (!getLog) {
      log = await db.query(
        `INSERT INTO transcribe_log (user_id)
       VALUES ($1) RETURNING *`,
        [user_id]
      );
    } else {
      log = await db.query(
        `UPDATE transcribe_log
        SET count = count + 1
        WHERE user_id=$1 AND date > (CURRENT_TIMESTAMP - INTERVAL '1 day')
        RETURNING *`,
        [user_id]
      );
    }

    return log[0];
  }
}
module.exports = TranscribeLog;
