const jwt = require("jsonwebtoken");
function decodeJwt(token) {
  return jwt.decode(token?.substring(7));
}

module.exports = { decodeJwt };
