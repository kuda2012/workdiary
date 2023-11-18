const jwt = require("jsonwebtoken");
const jsonschema = require("jsonschema");
let { SECRET_KEY } = require("../config");
const userSchema = require("../schema/userschema.json");
const ExpressError = require("../expressError");
function tokenIsCurrent(req, res, next) {
  try {
    const { authorization } = req.headers;
    const verified = jwt.verify(authorization.substring(7), SECRET_KEY);
    if (verified) {
      return next();
    } else {
      throw new ExpressError("You are not logged in, please login first", 401);
    }
  } catch (error) {
    if (
      error.message == "invalid token" ||
      error.message == "invalid signature"
    ) {
      error.status = 400;
    }
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
