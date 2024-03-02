const { db } = require("../db");
async function deleteUnverifiedUsers24hrs() {
  await db.query(`DELETE FROM users
                  WHERE verified = false
                  AND created_at < current_timestamp - interval '1 day'`);
  return "Job is done!";
}

module.exports = { deleteUnverifiedUsers24hrs };
