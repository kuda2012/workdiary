const { decodeJwt } = require("../helpers/decodeJwt");
const User = require("../models/User");
const ExpressError = require("../expressError");
const Post = require("../models/Post");
const moment = require("moment");

exports.signup = async (req, res, next) => {
  try {
    let getUser = await User.getUser(null, req.body.email);
    const checkIfAnyPosts = await Post.getAllPostDates(getUser?.id);
    if (
      (getUser &&
        !getUser?.verified &&
        moment
          .duration(moment().diff(moment(getUser?.created_at)))
          .asMinutes()) > 20 &&
      checkIfAnyPosts?.length === 0
    ) {
      // Delete user if you are trying to create the same account within the last 20 mins since
      // creating an account but have not verified it yet
      await User.delete(getUser.id);
      getUser = await User.getUser(null, req.body.email);
    }
    if (!getUser) {
      let user = await User.create(req.body);
      let message = await User.sendEmailVerification(user);
      res.json({ message });
    } else {
      throw new ExpressError(
        "This email is already taken. Please use a different one",
        409
      );
    }
  } catch (error) {
    next(error);
  }
};

exports.loginGoogle = async (req, res, next) => {
  try {
    const payload = await User.verifyGoogleToken(req.body.google_access_token);
    const doesUserExist = await User.getUser(null, payload.email);
    let user;
    if (!doesUserExist) {
      user = await User.createGoogleUser(payload);
    } else if (doesUserExist && doesUserExist.auth_provider !== "google") {
      throw new ExpressError(
        "A user already exists for this email. Please sign in by entering your username and password",
        400
      );
    }
    const token = await User.generateWorkdiaryAccessToken(
      doesUserExist ? doesUserExist : user
    );
    res.send({ workdiary_token: token });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    let token = await User.getLoggedIn(req.body);
    res.json({ workdiary_token: token });
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
    next(erro);
  }
};

exports.checkedToken = async (req, res, next) => {
  // refreshing token after being verified in tokenIsCurrent
  try {
    const workdiary_token = await User.generateWorkdiaryAccessToken(
      decodeJwt(req.headers.authorization)
    );
    res.send({ workdiary_token });
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
