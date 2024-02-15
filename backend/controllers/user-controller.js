const User = require("../models/User");
const ExpressError = require("../expressError");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const { decodeJwt } = require("../helpers/decodeJwt");
const { db } = require("../db");

exports.signup = async (req, res, next) => {
  try {
    let getUser = await User.getUser(null, req.body.email);
    let userDeleted = false;
    if (
      (getUser &&
        !getUser?.verified &&
        moment
          .duration(moment().diff(moment(getUser?.created_at)))
          .asMinutes()) > 30
    ) {
      // Delete user if you are trying to create the same account within the last 20 mins since
      // creating an account but have not verified it yet
      await User.delete(getUser.id);
      userDeleted = true;
    }
    if (!getUser || userDeleted) {
      let user = await User.create(req.body);
      let message = await User.sendEmailVerification(user);
      res.json({ message });
    } else {
      throw new ExpressError(
        "This email is already taken. Please use a different one.",
        409
      );
    }
  } catch (error) {
    next(error);
  }
};

exports.loginOrSignupGoogle = async (req, res, next) => {
  try {
    const payload = await User.verifyGoogleToken(req.body.google_access_token);
    let getUser = await User.getUser(null, payload.email);
    let userDeleted = false;
    let first_time_login;
    if (
      (getUser &&
        !getUser?.verified &&
        moment
          .duration(moment().diff(moment(getUser?.created_at)))
          .asMinutes()) > 30
    ) {
      // Delete user if you are trying to create the same account within the last 30 mins since
      // creating an account but have not verified it yet
      await User.delete(getUser.id);
      userDeleted = true;
    }

    if (!getUser || userDeleted) {
      getUser = await User.createGoogleUser(payload);
      first_time_login = true;
    } else if (getUser && getUser.auth_provider !== "google") {
      throw new ExpressError(
        "A user already exists for this email. Please sign in by entering your username and password.",
        400
      );
    }
    const token = await User.generateWorkdiaryAccessToken(getUser);
    res.send({ workdiary_token: token, first_time_login });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    let token = await User.getLoggedIn(req.body);
    // log the login
    // tell query the logins table, if there are no previous logins with matching user_id and email, return "first_time_login : true"
    let first_time_login;
    let { id, email, name } = jwt.decode(token);
    let logins = await db.query(
      `SELECT * from user_logins
      WHERE user_id=$1 AND email=$2`,
      [id, email]
    );
    if (logins.length === 0) {
      first_time_login = true;
    }
    await db.query(
      `INSERT INTO user_logins (user_id, email, name, login_time, file_source, ip_address, user_agent)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5, $6)`,
      [id, email, name, req.body.source, req.ip, req.headers["user-agent"]]
    );
    res.json({ workdiary_token: token, first_time_login });
  } catch (error) {
    next(error);
  }
};

exports.verifyAccount = async (req, res, next) => {
  try {
    let message = await User.verifyAccount(req.query.token);
    res.json({ message });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { email } = decodeJwt(req.headers.authorization);
    let message = await User.changePassword(req.body, email);
    res.json({
      message,
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, user_id } = decodeJwt(req.headers.authorization);
    const message = await User.resetPassword(
      req.body,
      user_id,
      email,
      req.headers.authorization
    );
    res.json({
      message,
    });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    let message = await User.forgotPassword(req.body);
    res.json({
      message,
    });
  } catch (error) {
    next(error);
  }
};

exports.changeAlarm = async (req, res, next) => {
  try {
    const { id } = decodeJwt(req.headers.authorization);
    let user = await User.getUser(id);
    if (user) {
      user = await User.update(req.body, id);
    }
    res.send({ user: { ...user } });
  } catch (error) {
    next(error);
  }
};

exports.otherSettings = async (req, res, next) => {
  try {
    const { id } = decodeJwt(req.headers.authorization);
    let user = await User.getUser(id);
    if (user) {
      user = await User.update(req.body, id);
    }
    res.send({ user: { ...user } });
  } catch (error) {
    next(error);
  }
};

exports.checkedToken = async (req, res, next) => {
  // refreshing token after being verified in tokenIsCurrent
  try {
    const userInfo = decodeJwt(req.headers.authorization);
    const userExists = await User.getUser(userInfo.id);
    if (userExists?.verified) {
      await db.query(
        `INSERT INTO user_logins (user_id, email, name, login_time, file_source, ip_address, user_agent)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5, $6)`,
        [
          userExists.id,
          userExists.email,
          userExists.name,
          req.body.source,
          req.ip,
          req.headers["user-agent"],
        ]
      );
      const workdiary_token = await User.generateWorkdiaryAccessToken(userInfo);
      res.send({ workdiary_token });
    } else {
      throw new ExpressError(
        "User is not verified. Send an email to contact@workdiary.me",
        401
      );
    }
  } catch (error) {
    next(error);
  }
};

exports.getAccountInfo = async (req, res, next) => {
  try {
    const { id } = decodeJwt(req.headers.authorization);
    const user = await User.getUser(id);
    res.send({ user });
  } catch (error) {
    next(error);
  }
};

exports.contactUs = async (req, res, next) => {
  try {
    const message = await User.contactUs(req.body);
    res.json({
      message,
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = decodeJwt(req.headers.authorization);
    const doesUserExist = await User.getUser(id);
    if (doesUserExist) {
      await User.delete(id);
    }
    res.send({ message: "Your account has been deleted!" });
  } catch (error) {
    next(error);
  }
};
