const jwt = require("jsonwebtoken");
const jsonschema = require("jsonschema");
const resetPasswordSchema = require("../schema/resetPasswordSchema.json");
const changePasswordSchema = require("../schema/changePasswordSchema.json");
const userSchema = require("../schema/userSchema.json");

const ExpressError = require("../expressError");
const rateLimit = require("express-rate-limit");
let {
  VERIFY_ACCOUNT_SECRET_KEY,
  GENERAL_SECRET_KEY,
  RESET_PASSWORD_SECRET_KEY,
} = require("../config");
const forgotPasswordRateLimiter = rateLimit({
  windowMs: 60 * 15 * 1000, // 15 min
  limit: 4, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  handler: (req, res, next, options) => {
    try {
      return next(new ExpressError(options.message, 429));
    } catch (error) {
      next(error);
    }
  },
});
const resetPasswordRateLimiter = rateLimit({
  windowMs: 60 * 15 * 1000, // 15 min
  limit: 3, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  handler: (req, res, next, options) => {
    try {
      return next(new ExpressError(options.message, 429));
    } catch (error) {
      next(error);
    }
  },
});

function tokenIsCurrent(req, res, next) {
  try {
    const { authorization } = req.headers;
    jwt.verify(authorization.substring(7), GENERAL_SECRET_KEY);
    return next();
  } catch (error) {
    if (error.message === "jwt expired") {
      error.message = "Your token has expired";
    }
    if (error.message === "invalid token") {
      error.message = "Your token is invalid";
    }
    error.status = 403;
    next(error);
  }
}
function verifyAccountVerificationToken(req, res, next) {
  try {
    jwt.verify(req.query.token, VERIFY_ACCOUNT_SECRET_KEY);
    return next();
  } catch (error) {
    if (error.message === "jwt expired") {
      error.message =
        "Your verification link has expired. Please return to the app and attempt to login to have another one sent to you!";
    }
    if (error.message === "invalid token") {
      error.message = "Your token is invalid";
    }
    error.status = 403;
    next(error);
  }
}
function resetPasswordToken(req, res, next) {
  try {
    const { authorization } = req.headers;
    jwt.verify(authorization.substring(7), RESET_PASSWORD_SECRET_KEY);
    return next();
  } catch (error) {
    if (error.message === "jwt expired") {
      error.message =
        "Your verification link has expired. Please return to the app and attempt to login to have another one sent to you!";
    }
    if (error.message === "invalid token") {
      error.message = "Your token is invalid";
    }
    error.status = 403;
    next(error);
  }
}
function userIsValidatedSignup(req, res, next) {
  try {
    const result = jsonschema.validate(req.body, userSchema);
    if (result.valid) {
      return next();
    } else {
      const listOfErrors = result.errors.map((error) => error.stack);
      const err = new ExpressError(listOfErrors, 400);
      return next(err);
    }
  } catch (error) {
    next(error);
  }
}

function resetPasswordValidated(req, res, next) {
  try {
    const result = jsonschema.validate(req.body, resetPasswordSchema);
    if (result.valid) {
      return next();
    } else {
      const listOfErrors = result.errors.map((error) => error.stack);
      const err = new ExpressError(listOfErrors, 400);
      return next(err);
    }
  } catch (error) {
    next(error);
  }
}
function changePasswordValidated(req, res, next) {
  try {
    const result = jsonschema.validate(req.body, changePasswordSchema);
    if (result.valid) {
      return next();
    } else {
      const listOfErrors = result.errors.map((error) => error.stack);
      const err = new ExpressError(listOfErrors, 400);
      return next(err);
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  tokenIsCurrent,
  userIsValidatedSignup,
  changePasswordValidated,
  resetPasswordValidated,
  forgotPasswordRateLimiter,
  resetPasswordRateLimiter,
  verifyAccountVerificationToken,
  resetPasswordToken,
};
