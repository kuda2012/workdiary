const jwt = require("jsonwebtoken");
const jsonschema = require("jsonschema");
let { SECRET_KEY } = require("../config");
const userSchema = require("../schema/userschema.json");
const ExpressError = require("../expressError");
function tokenIsCurrent(req, res, next) {
  try {
    const { authorization } = req.headers;
    jwt.verify(authorization.substring(7), SECRET_KEY);
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
function userIsValidated(req, res, next) {
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

module.exports = {
  tokenIsCurrent,
  userIsValidated,
};
