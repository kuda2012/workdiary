const db = require("../db");
class User {
  static async create(payload) {
    const getUser = await db.query(
      `INSERT INTO users (id, email, name)
       VALUES ($1, $2, $3) RETURNING id, email, name`,
      [payload.sub, payload.email, payload.name]
    );
    return getUser[0];
  }
  static async delete(user_id) {
    const getUser = await db.query(
      `DELETE FROM USERS
       WHERE id=$1`,
      [user_id]
    );
    return getUser;
  }
  static async update(body, user_id) {
    let queryText = "UPDATE users SET";
    const queryValues = [];
    if (body.alarm_status !== undefined) {
      queryValues.push(body.alarm_status); // Add the value to the parameter array
      queryText += ` alarm_status = $${queryValues.length},`; // Add the column to the query
    }
    if (body.alarm_time !== undefined) {
      queryValues.push(body.alarm_time); // Add the value to the parameter array
      queryText += ` alarm_time = $${queryValues.length},`; // Add the column to the query
    }
    if (body.alarm_days !== undefined) {
      queryValues.push(body.alarm_days); // Add the value to the parameter array
      queryText += ` alarm_days = $${queryValues.length} ::JSONB[],`; // Add the column to the query
    }
    if (body.auto_pull_tabs !== undefined) {
      queryValues.push(body.auto_pull_tabs); // Add the value to the parameter array
      queryText += ` auto_pull_tabs = $${queryValues.length},`; // Add the column to the query
    }
    queryText = queryText.slice(0, -1);
    queryValues.push(user_id);
    queryText += ` WHERE id = $${queryValues.length} RETURNING *`;
    const result = await db.query(queryText, queryValues);
    return {
      ...result[0],
    };
  }
  static async getUser(id) {
    const getUser = await db.oneOrNone(`SELECT * FROM users WHERE id = $1`, [
      id,
    ]);
    return getUser;
  }
}

module.exports = User;
