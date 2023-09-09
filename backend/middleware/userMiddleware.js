const jwt = require("jsonwebtoken");
let { SECRET_KEY } = require("../config");
function tokenIsCurrent(req, res, next) {
  try {
    const { worksnap_token } = req.body;
    const verified = jwt.verify(worksnap_token, SECRET_KEY);
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

module.exports = {
  tokenIsCurrent,
};
