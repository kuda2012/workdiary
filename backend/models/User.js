const { db } = require("../db");
const { v4: uuid } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const axios = require("axios");
const ExpressError = require("../expressError");
const {
  VERIFY_ACCOUNT_SECRET_KEY,
  RESET_PASSWORD_SECRET_KEY,
  GENERAL_SECRET_KEY,
  ZOHO_EMAIL_PASSWORD,
  FRONTEND_URL,
} = require("../config");
const { BCRYPT_HASH_ROUNDS } = require("../config");
const { getFirstName } = require("../helpers/getFirstName");

class User {
  static async createGoogleUser(payload) {
    const getUser = await db.query(
      `INSERT INTO users (id, email, first_name, full_name, auth_provider, verified, time_verified)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP) RETURNING id, email, first_name, full_name, auth_provider, verified`,
      [
        uuid(),
        payload.email,
        payload.first_name,
        payload.full_name,
        "google",
        true,
      ]
    );
    this.sendWelcomeEmail(getUser[0]);
    return getUser[0];
  }

  static async create(body) {
    const { email, password, full_name } = body;
    if (password.length < 8 || password.length > 25) {
      throw new ExpressError(
        "Password length must be at least 8 characters but not longer than 25",
        400
      );
    }
    const hashedPassword = await bcrypt.hash(password, BCRYPT_HASH_ROUNDS);
    const newUser = await db.query(
      `INSERT INTO users (id, email, password, first_name, full_name, auth_provider)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, first_name, full_name, auth_provider, verified`,
      [
        uuid(),
        email?.toLowerCase(),
        hashedPassword,
        getFirstName(full_name),
        full_name,
        "username_password",
      ]
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
      `SELECT email, password from users WHERE email=$1 AND password IS NOT NULL`,
      [email?.toLowerCase()]
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
            email: result.email,
            first_name: result.first_name,
            full_name: result.full_name,
          });
        } else {
          const response = await this.sendEmailVerification(result);
          throw new ExpressError(response, 401);
        }
      } else {
        throw new ExpressError(
          "The email and password combination you have entered do not match our records. Please try again.",
          400
        );
      }
    } else {
      // No user was found from getUserPassword
      throw new ExpressError(
        "The email and password combination you have entered do not match our records. Please try again.",
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
        expiresIn: "30m",
      }
    );
    // Email options
    const mailOptions = {
      from: "no-reply@workdiary.me",
      to: user.email,
      subject: "Workdiary: Account Verification",
      html: `<div>
                      <img src="cid:work_diary_image" alt="Workdiary Image" />
                      <p>
                      <a href="${FRONTEND_URL}/verify-account?token=${token}">
                        Click here</a>
                         to verify your account
                    </p>
                    <small>Didn't request this? Just ignore.</small>
                    <div>
                    <small>
                        <a href="https://chromewebstore.google.com/detail/workdiary/lbjmgndoajjfcodenfoicgenhjphacmp">
                            Workdiary
                        </a> 
                    </small>
                    </div>
                </div>`,
      attachments: [
        {
          filename: "Workdiary_logo.png",
          path: "./Workdiary_logo.png",
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
    return "A verification link has been sent to your email. Please click on it to finalize the creation of your account! Check your spam folder if need be.";
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
      subject: "Welcome to Workdiary!",
      html: `<div>
                  <img src="cid:work_diary_image" alt="Workdiary Image" />
                  <div style="position: relative; left: 15px;">
                  <p>Hi ${user.first_name},</p>
                   <p style="max-width: 600px;">
                    Welcome to Workdiary! I am glad you have taken this step to gain more
                    control of how you choose to remember your work. Given that work is such a fundamental
                    aspect of our lives, I believe it's in our best interests to stay on top of 
                    what we tell ourselves about it. Let this app be a platform for you
                    to develop a richer mental narrative of your work endeavors that will 
                    make you more compelling during job interviews,
                    networking events, or anytime you get a chance to say your piece.
                  </p>
                  <p>Have a fantastic day, and enjoy using Workdiary!</p>
                  <p>The Workdiary Team</p>
                  <p>P.S. Share your thoughts or concerns with us any time at: <a href="mailto:contact@workdiary.me">contact@workdiary.me</a></p>
                  <small>
                        <a href="https://chromewebstore.google.com/detail/workdiary/lbjmgndoajjfcodenfoicgenhjphacmp">
                            Workdiary
                        </a> 
                    </small>
                  </div>
                </div>`,
      attachments: [
        {
          filename: "Workdiary_logo.png",
          path: "./Workdiary_logo.png",
          cid: "work_diary_image", // Same as the src cid in the img tag
        },
      ],
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending welcome email:", error);
      } else {
        console.log("Welcome email sent", info.response);
      }
    });
    return;
  }

  static async sendDownloadLink(email) {
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
      to: email,
      subject: "Workdiary: Installation link",
      html: `<div>
                  <img src="cid:Workdiary_logo" alt="Workdiary Image" />
                  <p>Greetings,</p>
                   <p style="max-width: 600px;">
                   Here is the requested link to install the app:
                   <a href="https://chromewebstore.google.com/detail/workdiary/lbjmgndoajjfcodenfoicgenhjphacmp">
                            Workdiary
                   </a>
                  </p>
                  <p>The Workdiary Team</p>
                  <small>Didn't request this? Just ignore.</small>
                </div>`,
      attachments: [
        {
          filename: "Workdiary_logo.png",
          path: "./Workdiary_logo.png",
          cid: "Workdiary_logo", // Same as the src cid in the img tag
        },
      ],
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending install link", error);
      } else {
        console.log("Install link sent", info.response);
      }
    });
    return "An installation link has been sent to the provided email.";
  }

  static async verifyAccount(token) {
    const user = jwt.decode(token);
    const getUser = await this.getUser(user.id);
    if (getUser && !getUser?.verified) {
      await db.query(
        `UPDATE users
        SET verified= true,
       time_verified=CURRENT_TIMESTAMP
      where id=$1 RETURNING id, email, verified, time_verified
        `,
        [user.id]
      );
      return "Your account has been verified. You can now head back to the app and login into your account!";
    } else if (getUser?.verified) {
      return "Your account has already been verified. You are free to head back to the app and login into your account!";
    } else {
      return "Our apologies. Please restart the sign up process.";
    }
  }
  static async changePassword(body, email) {
    const { password } = body;
    const { auth_provider } = await db.oneOrNone(
      `SELECT auth_provider from users WHERE email=$1`,
      [email?.toLowerCase()]
    );
    if (auth_provider === "google") {
      throw new ExpressError(
        "Google sign-on users cannot reset their passwords",
        400
      );
    }
    if (body.new_password.length < 8 || body.new_password.length > 25) {
      throw new ExpressError(
        "Password length must be at least 8 characters but not longer than 25",
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
      [email?.toLowerCase()]
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
          [newPassword, email?.toLowerCase()]
        );
        return "Password has been successfully changed.";
      } else {
        throw new ExpressError("Incorrect Current Password", 400);
      }
    } else {
      throw new ExpressError(
        "User does not exist or you may have used Google sign-in to create an account. If you used Google sign-in, please use that to sign-in.",
        404
      );
    }
  }

  static async resetPassword(body, user_id, email, token) {
    const { auth_provider } = await db.oneOrNone(
      `SELECT auth_provider from users WHERE email =$1`,
      [email?.toLowerCase()]
    );
    if (auth_provider === "google") {
      throw new ExpressError(
        "Google sign-on users cannot reset their passwords",
        400
      );
    }
    if (body.new_password.length < 8 || body.new_password.length > 25) {
      throw new ExpressError(
        "Password length must be at least 8 characters but not longer than 25",
        400
      );
    }
    if (body.new_password !== body.new_password_copy) {
      throw new ExpressError("New Passwords do not match", 400);
    }

    const tokenAlreadyUsed = await db.oneOrNone(
      `SELECT token from invalid_tokens
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
        [newPassword, email?.toLowerCase()]
      );
      await db.query(
        `INSERT INTO invalid_tokens (user_id, token)
          VALUES ($1, $2)`,
        [user_id, token]
      );
      return "Password has been sucessfully changed.";
    } else {
      throw new ExpressError("Issue with resetting password", 400);
    }
  }

  static async forgotPassword(body) {
    const email = body.email?.toLowerCase();
    const user = await this.getUser(null, email);

    if (user?.verified) {
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
        { user_id: user.id, email },
        RESET_PASSWORD_SECRET_KEY,
        {
          expiresIn: "30m",
        }
      );

      // Email options
      const mailOptions =
        user.auth_provider === "google"
          ? {
              from: "no-reply@workdiary.me",
              to: email,
              subject: "Workdiary: Password Reset",
              html: `<div>
                      <img src="cid:work_diary_image" alt="Workdiary Image" />
                      <p>
                      Your account is a Google one-click login. You cannot reset your password.
                      Just click the Google login button on the Login/Signup page to login!
                    </p>
                    <small>Didn't request this? Just ignore.</small>
                    <div>
                    <small>
                        <a href="https://chromewebstore.google.com/detail/workdiary/lbjmgndoajjfcodenfoicgenhjphacmp">
                            Workdiary
                        </a> 
                    </small>
                    </div>
                </div>`,
              attachments: [
                {
                  filename: "Workdiary_logo.png",
                  path: "./Workdiary_logo.png",
                  cid: "work_diary_image", // Same as the src cid in the img tag
                },
              ],
            }
          : {
              from: "no-reply@workdiary.me",
              to: email,
              subject: "Workdiary: Password Reset",
              html: `<div>
                      <img src="cid:work_diary_image" alt="Workdiary Image" />
                      <p>
                       
                      <a href="${FRONTEND_URL}/reset-password?token=${token}">
                        Click here</a>
                         to reset your password. You have 30 mins until it expires.
                    </p>
                    <small>Didn't request this? Just ignore.</small>
                    <div>
                    <small>
                        <a href="https://chromewebstore.google.com/detail/workdiary/lbjmgndoajjfcodenfoicgenhjphacmp">
                            Workdiary
                        </a> 
                    </small>
                    </div>
                </div>`,
              attachments: [
                {
                  filename: "Workdiary_logo.png",
                  path: "./Workdiary_logo.png",
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
    return "If the given email is on file, we have a sent a link there to reset your password. Check your spam folder if need be.";
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
                <p><strong>Sender's Email:</strong> ${body.email?.toLowerCase()}</p>
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
    if (body.alarm_days !== undefined) {
      queryValues.push(body.alarm_days); // Add the value to the parameter array
      queryText += ` alarm_days = $${queryValues.length} ::JSONB[],`; // Add the column to the query
    }
    queryText = queryText.slice(0, -1);
    queryValues.push(user_id);
    queryText += ` WHERE id = $${queryValues.length} returning id, email, first_name, full_name, alarm_status, alarm_time, alarm_days, auth_provider, verified`;
    const result = await db.query(queryText, queryValues);
    return {
      ...result[0],
    };
  }
  static async getUser(id, email) {
    const getUser = await db.oneOrNone(
      `SELECT id, email, first_name, full_name, alarm_status, alarm_time, alarm_days, auth_provider, verified, created_at FROM users
       WHERE id = $1 OR email = $2`,
      [id, email?.toLowerCase()]
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
    data.full_name = getInfo.data.names[0].displayName;
    data.first_name = getInfo.data.names[0].givenName;
    return data;
  }

  static async generateWorkdiaryAccessToken(payload) {
    const token = jwt.sign(
      {
        id: payload.id,
        email: payload.email,
        first_name: payload.first_name,
        full_name: payload.full_name,
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
