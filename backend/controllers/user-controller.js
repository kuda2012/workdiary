const axios = require("axios");
const { SECRET_KEY } = require("../config");
const { decodeJwt } = require("../helpers/decodeJwt");
const User = require("../models/User");
const ExpressError = require("../expressError");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  try {
    let user = await User.create(req.body);
    let token = await User.getLoggedIn(req.body);
    res.json({ worksnap_token: token });
  } catch (error) {
    if (error.code === "23505") {
      error.status = 409;
      error.message =
        "This email is already taken. Please try a different one.";
    }
    next(error);
  }
};

exports.loginGoogle = async (req, res) => {
  const payload = await User.verifyGoogleToken(req.body.google_access_token);
  const token = await User.generateWorksnapAccessToken(payload);
  const doesUserExist = await User.getUser(payload.sub);
  if (!doesUserExist) {
    await User.createGoogleUser(payload);
  }
  res.send({ worksnap_token: token });
};

exports.login = async (req, res, next) => {
  try {
    let token = await User.getLoggedIn(req.body);
    res.json({ worksnap_token: token });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    let message = await User.changePassword(req.body);
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

exports.changeAlarm = async (req, res) => {
  const { id } = decodeJwt(req.headers.authorization);
  const user = await User.getUser(id);
  if (user) {
    user = await User.update(req.body, id);
  }
  res.send({ user: { ...user } });
};

exports.checkedToken = async (req, res) => {
  const worksnap_token = req.headers.authorization.substring(7);
  res.send({ worksnap_token });
};

exports.getAccountInfo = async (req, res) => {
  const { id } = decodeJwt(req.headers.authorization);
  const user = await User.getUser(id);
  res.send({ user });
};

exports.delete = async (req, res) => {
  const { id } = decodeJwt(req.headers.authorization);
  const doesUserExist = await User.getUser(id);
  if (doesUserExist) {
    await User.delete(id);
  }
  res.send({ message: "Your account has been deleted!" });
};
