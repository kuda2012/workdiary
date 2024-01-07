const { db } = require("../db");
const ExpressError = require("../expressError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");
const nodemailer = require("nodemailer");
const axios = require("axios");
const {
  VERIFY_ACCOUNT_SECRET_KEY,
  GENERAL_SECRET_KEY,
  ZOHO_EMAIL_PASSWORD,
  BACKEND_URL,
} = require("../config");
const { BCRYPT_HASH_ROUNDS } = require("../config");

class User {
  static async createGoogleUser(payload) {
    const getUser = await db.query(
      `INSERT INTO users (id, email, name, auth_provider, verified, time_verified)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING id, email, name, auth_provider, verified`,
      [uuid(), payload.email, payload.name, "google", true]
    );
    this.sendWelcomeEmail(getUser[0]);
    return getUser[0];
  }

  static async create(body) {
    const { email, password, name } = body;
    // if (body.password !== body.password_copy) {
    //   throw new ExpressError("Passwords do not match", 400);
    // }
    const hashedPassword = await bcrypt.hash(password, BCRYPT_HASH_ROUNDS);
    const newUser = await db.query(
      `INSERT INTO users (id, email, password, name, auth_provider)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, auth_provider, verified`,
      [uuid(), email.toLowerCase(), hashedPassword, name, "username_password"]
    );
    this.sendWelcomeEmail(newUser[0]);
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
        if (result.verified) {
          return this.generateWorkdiaryAccessToken({
            id: result.id,
            name: result.name,
            email: result.email,
          });
        } else {
          const response = await this.sendEmailVerification(result);
          throw new ExpressError(response, 401);
        }
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

  static async sendEmailVerification(user) {
    const transporter = nodemailer.createTransport({
      host: "smtppro.zoho.com",
      port: 587,
      secure: false,
      auth: {
        user: "no-reply@workdiary.me", // Your Zoho Mail email address
        pass: ZOHO_EMAIL_PASSWORD, // Your Zoho Mail password or app-specific password
      },
    });
    const token = jwt.sign(
      { id: user.id, email: user.email },
      VERIFY_ACCOUNT_SECRET_KEY,
      {
        expiresIn: "20m",
      }
    );
    // const token = jwt.sign({ yes: "add" }, GENERAL_SECRET_KEY, {
    //   expiresIn: "10m",
    // });
    // Email options
    const mailOptions = {
      from: "no-reply@workdiary.me",
      to: user.email,
      subject: "Work Diary: Account Verification",
      html: `<div>
                      <img src="cid:work_diary_image" alt="Work Diary Image" />
                      <p>
                      <a href="${BACKEND_URL}/users/verify-account?token=${token}">
                        Click here</a>
                         to verify your account
                    </p>
                    <small>Didn't request this? Just ignore</small>
                    <div>
                    <small>
                        <a href="https://chromewebstore.google.com/">
                            Download app
                        </a> 
                    </small>
                    </div>
                </div>`,
      attachments: [
        {
          filename: "w_trident.png",
          path: "./w_trident.png",
          cid: "work_diary_image", // Same as the src cid in the img tag
        },
      ],
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending verificaton email:", error);
      } else {
        console.log("Verification email sent:", info.response);
      }
    });
    return "A verification link has been sent to your email. Please click on it to finalize the creation of your account!";
  }

  static async sendWelcomeEmail(user) {
    const transporter = nodemailer.createTransport({
      host: "smtppro.zoho.com",
      port: 587,
      secure: false,
      auth: {
        user: "no-reply@workdiary.me", // Your Zoho Mail email address
        pass: ZOHO_EMAIL_PASSWORD, // Your Zoho Mail password or app-specific password
      },
    });

    const mailOptions = {
      from: "no-reply@workdiary.me",
      to: user.email,
      subject: "Welcome to WorkDiary!",
      html: `<div>
                  <img src="cid:work_diary_image" alt="Work Diary Image" />
                  <p>Hi ${user.name},</p>
                  <p>Welcome to Workdiary! We're thrilled to have you onboard and help you remember the awesome things you accomplish each day.</p>

                  <h2>Here's how to use the app</h2>

                  <h3>Simple Version:</h3>
                  <ol>
                    <li>Press record: Share a quick voice note about your day.</li>
                    <li>Or, type it out: Whatever works best for you!</li>
                    <li>That's it. Easy huh?</li>
                  </ol>

                  <h3>Want a bit more? Here's how to supercharge your Workdiary experience:</h3>
                  <ol>
                    <li>Get notified: We'll remind you at 5pm (customizable!) to capture your day.</li>
                    <li>Voice or text: Share your thoughts, whichever way feels best.</li>
                    <li>Tag it: Add a quick label to categorize your entries.</li>
                    <li>Save your tabs: Grab relevant browser tabs to bring back past contexts.</li>
                  </ol>

                  <p>Have a fantastic day, and enjoy using Workdiary!</p>
                  <p>The Workdiary Team</p>
                  <p>P.S. We're always building new features based on user feedback. Share your thoughts with us any time: <a href="mailto:contact@workdiary.me">contact@workdiary.me</a>!</p>
                </div>`,
      attachments: [
        {
          filename: "w_trident.png",
          path: "./w_trident.png",
          cid: "work_diary_image", // Same as the src cid in the img tag
        },
      ],
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending welcome email:", error);
      } else {
        console.log("Welcome email sent:", info.response);
      }
    });
    return;
  }

  static async verifyAccount(token) {
    const user = jwt.decode(token);
    const { verified } = await this.getUser(user.id);
    if (!verified) {
      await db.query(
        `UPDATE users
        SET verified= true,
       time_verified=CURRENT_TIMESTAMP
      where id=$1 RETURNING id, email, verified, time_verified
        `,
        [user.id]
      );
      return "Your account has been verified. You can now login into your account!";
    } else {
      return "Your account has already been verified. You are free to login into your account!";
    }
  }
  static async changePassword(body, email) {
    const { password } = body;
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
        "User does not exist or you may have used Google sign-in to create account. If you used Google sign-in you cannot change your password",
        404
      );
    }
  }
  static async resetPassword(body, user_id, email, token) {
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

    const tokenAlreadyUsed = await db.oneOrNone(
      `Select token from invalid_tokens
    WHERE token = $1`,
      [token]
    );

    if (tokenAlreadyUsed) {
      throw new ExpressError("You've already reset your password", 400);
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
      await db.query(
        `INSERT INTO invalid_tokens (user_id, token)
        VALUES ($1, $2)`,
        [user_id, token]
      );
      return "Password has been changed";
    } else {
      throw new ExpressError("Issue with resetting password", 400);
    }
  }

  static async forgotPassword(body) {
    const { email } = body;
    const user = await this.getUser(null, email);
    if (user.auth_provider === "google") {
      return "If the given email is on file, we have a sent a link there to reset your password. Reminder: If your account is a Google one-click login, you do not have a password. Just login with the Google button!";
    }
    if (user) {
      const transporter = nodemailer.createTransport({
        host: "smtppro.zoho.com",
        port: 587,
        secure: false,
        auth: {
          user: "no-reply@workdiary.me", // Your Zoho Mail email address
          pass: ZOHO_EMAIL_PASSWORD, // Your Zoho Mail password or app-specific password
        },
      });
      const token = jwt.sign({ user_id: user.id, email }, GENERAL_SECRET_KEY, {
        expiresIn: "10m",
      });
      // const token = jwt.sign({ yes: "add" }, GENERAL_SECRET_KEY, {
      //   expiresIn: "10m",
      // });
      // Email options
      const mailOptions = {
        from: "no-reply@workdiary.me",
        to: email,
        subject: "Work Diary: Password Reset",
        html: `<div>
                      <img src="cid:work_diary_image" alt="Work Diary Image" />
                      <p>
                       
                      <a href="https://fe-workdiary.onrender.com/reset-password?token=${token}">
                        Click here</a>
                         to reset your password. You have about 10 mins until it expires
                    </p>
                    <small>Didn't request this? Just ignore</small>
                    <div>
                    <small>
                        <a href="https://chromewebstore.google.com/">
                            Download app
                        </a> 
                    </small>
                    </div>
                </div>`,
        attachments: [
          {
            filename: "w_trident.png",
            path: "./w_trident.png",
            cid: "work_diary_image", // Same as the src cid in the img tag
          },
        ],
      };

      // Send email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending forgot password email:", error);
        } else {
          console.log("Forgot password email sent:", info.response);
        }
      });
    }
    return "If the given email is on file, we have a sent a link there to reset your password. Reminder: If your account is a Google one-click login, you do not have a password. Just login with the Google button!";
  }
  static async contactUs(body) {
    const transporter = nodemailer.createTransport({
      host: "smtppro.zoho.com",
      port: 587,
      secure: false,
      auth: {
        user: "no-reply@workdiary.me", // Your Zoho Mail email address
        pass: ZOHO_EMAIL_PASSWORD, // Your Zoho Mail password or app-specific password
      },
    });

    const mailOptions = {
      from: "no-reply@workdiary.me",
      to: "contact@workdiary.me",
      subject: `From Contact form: ${body.subject}`,
      html: `<div>
                <p><strong>Name:</strong> ${body.name}</p>
                <p><strong>Sender's Email:</strong> ${body.email}</p>
                <p><strong>Message:</strong> ${body.message}</p>
            </div>`,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending contact-us email:", error);
      } else {
        console.log("Contact-us email sent:", info.response);
      }
    });

    return "Sent your email!";
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
    if (body.sound_effects !== undefined) {
      queryValues.push(body.sound_effects); // Add the value to the parameter array
      queryText += ` sound_effects = $${queryValues.length},`; // Add the column to the query
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
      `SELECT id, email, name, alarm_status, alarm_time, alarm_days, sound_effects, auth_provider, verified, created_at FROM users
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

  static async generateWorkdiaryAccessToken(payload) {
    const token = jwt.sign(
      {
        id: payload.id,
        email: payload.email,
        name: payload.name,
      },
      GENERAL_SECRET_KEY,
      {
        expiresIn: "1y",
      }
    );
    return token;
  }
}

module.exports = User;
