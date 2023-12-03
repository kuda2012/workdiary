const { decodeJwt } = require("../helpers/decodeJwt");
const User = require("../models/User");
const ExpressError = require("../expressError");

exports.signup = async (req, res, next) => {
  try {
    await User.create(req.body);
    let token = await User.getLoggedIn(req.body);
    res.json({ workdiary_token: token });
  } catch (error) {
    if (error.code === "23505") {
      error.status = 409;
      error.message =
        "This email is already taken. Please try a different one or try logging in through Google";
    }
    next(error);
  }
};

exports.loginGoogle = async (req, res, next) => {
  // excused
  try {
    const payload = await User.verifyGoogleToken(req.body.google_access_token);
    const doesUserExist = await User.getUser(payload.sub, payload.email);
    if (!doesUserExist) {
      await User.createGoogleUser(payload);
    } else if (doesUserExist && doesUserExist.auth_provider !== "google") {
      throw new ExpressError(
        "A user already exists for this email. Please sign in by entering your username and password",
        400
      );
    }
    const token = await User.generateWorkdiaryAccessToken(payload);
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
