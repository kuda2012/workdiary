const db = require("../db");
const ExpressError = require("../expressError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");
const nodemailer = require("nodemailer");
const axios = require("axios");
const { SECRET_KEY, EMAIL_PASSWORD } = require("../config");
const { BCRYPT_HASH_ROUNDS } = require("../config");

class User {
  static async createGoogleUser(payload) {
    const getUser = await db.query(
      `INSERT INTO users (id, email, name, auth_provider)
       VALUES ($1, $2, $3, $4) RETURNING id, email, name, auth_provider`,
      [payload.sub, payload.email, payload.name, "google"]
    );
    return getUser[0];
  }

  static async create(body) {
    const { email, password, name } = body;
    const hashedPassword = await bcrypt.hash(password, BCRYPT_HASH_ROUNDS);
    const newUser = await db.query(
      `INSERT INTO users (id, email, password, name, auth_provider)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, auth_provider`,
      [uuid(), email.toLowerCase(), hashedPassword, name, "username_password"]
    );
    return newUser[0];
  }
  static async getLoggedIn(body) {
    const { email, password } = body;
    if (!email || !password) {
      throw new ExpressError("Must enter a email and password", 400);
    }

    const getUserPassword = await db.oneOrNone(
      `SELECT email, password from users WHERE email =$1`,
      [email.toLowerCase()]
    );
    if (getUserPassword) {
      const passwordCorrect = await bcrypt.compare(
        password,
        getUserPassword.password
      );
      if (passwordCorrect) {
        const result = await this.getUser(null, email);
        const token = jwt.sign(result, SECRET_KEY, {
          expiresIn: "1y",
        });
        return token;
      } else {
        throw new ExpressError(
          "The email and password combination you have entered do not match any of our records. Please try again.",
          400
        );
      }
    } else {
      // No user was found from getUserPassword
      throw new ExpressError(
        "The email and password combination you have entered do not match any of our records. Please try again.",
        400
      );
    }
  }
  static async changePassword(body) {
    const { password, email } = body;
    const { auth_provider } = await db.oneOrNone(
      `SELECT auth_provider from users WHERE email =$1`,
      [email.toLowerCase()]
    );
    if (auth_provider === "google") {
      throw new ExpressError(
        "Google sign-on users cannot reset their passwords",
        400
      );
    }
    if (body.new_password.length < 5 || body.new_password.length > 25) {
      throw new ExpressError(
        "Password length must be longer than 4 characters but less than 26",
        400
      );
    }
    if (body.new_password !== body.new_password_copy) {
      throw new ExpressError("New Passwords do not match", 400);
    }
    const newPassword = await bcrypt.hash(
      body.new_password,
      BCRYPT_HASH_ROUNDS
    );
    const getUserPassword = await db.oneOrNone(
      `SELECT password from users WHERE email =$1`,
      [email.toLowerCase()]
    );
    if (getUserPassword) {
      const passwordCorrect = await bcrypt.compare(
        password,
        getUserPassword.password
      );
      if (passwordCorrect) {
        await db.query(
          `UPDATE users
                        SET password=$1
                        where email=$2`,
          [newPassword, email]
        );
        return "Password has been changed";
      } else {
        throw new ExpressError("Incorrect Current Password", 400);
      }
    } else {
      throw new ExpressError(
        "User does not exist or you may have used Google sign-in to create account. If you used Google sign-in you cannot change update your password through us",
        404
      );
    }
  }
  static async resetPassword(body, email) {
    const { auth_provider } = await db.oneOrNone(
      `SELECT auth_provider from users WHERE email =$1`,
      [email.toLowerCase()]
    );
    if (auth_provider === "google") {
      throw new ExpressError(
        "Google sign-on users cannot reset their passwords",
        400
      );
    }
    if (body.new_password.length < 5 || body.new_password.length > 25) {
      throw new ExpressError(
        "Password length must be longer than 4 characters but less than 26",
        400
      );
    }
    if (body.new_password !== body.new_password_copy) {
      throw new ExpressError("New Passwords do not match", 400);
    }

    const newPassword = await bcrypt.hash(
      body.new_password,
      BCRYPT_HASH_ROUNDS
    );
    if (newPassword) {
      await db.query(
        `UPDATE users
                        SET password=$1
                        where email=$2`,
        [newPassword, email]
      );
      return "Password has been changed";
    } else {
      throw new ExpressError("Issue with resetting password", 400);
    }
  }

  static async forgotPassword(body) {
    try {
      const { email } = body;
      const user = await this.getUser(null, email);
      if (user.auth_provider === "google") {
        return "If the given email is on file, we have a sent a link there to reset your password";
      }
      if (user) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "kuda.mwakutuya@gmail.com",
            pass: EMAIL_PASSWORD,
          },
          tls: {
            rejectUnauthorized: false, // Accept self-signed certificates
            // Or explicitly set the CA certificate if available
            // ca: [fs.readFileSync('path/to/your/ca.crt')]
          },
        });
        const token = jwt.sign({ email }, SECRET_KEY, {
          expiresIn: "30m",
        });
        // Email options
        const mailOptions = {
          from: "kuda.mwakutuya@gmail.com",
          to: email,
          subject: "Password Reset",
          html: `<p>Click the link to reset your password: <a href="https://http://localhost:5173/reset-password?token=${token}">Reset Password</a></p>`,
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
          } else {
            console.log("Email sent:", info.response);
          }
        });
      }
      return "If the given email is on file, we have a sent a link there to reset your password";
    } catch (error) {
      next(error);
    }
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
  static async getUser(id, email) {
    const getUser = await db.oneOrNone(
      `SELECT id, email, name, alarm_status, alarm_time, alarm_days, auth_provider FROM users
       WHERE id = $1 OR email = $2`,
      [id, email]
    );
    return getUser;
  }
  static async verifyGoogleToken(google_access_token) {
    // Verifies the access token
    const { data } = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?access_token=${google_access_token}`
    );
    // adding a name to the payload
    const getInfo = await axios.get(
      `https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses&access_token=${google_access_token}`
    );
    data.name = getInfo.data.names[0].displayName;
    return data;
  }

  static async generateWorksnapAccessToken(payload) {
    const token = jwt.sign(
      { id: payload.sub, email: payload.email, name: payload.name },
      SECRET_KEY,
      {
        expiresIn: "1y",
      }
    );
    return token;
  }
}

module.exports = User;
