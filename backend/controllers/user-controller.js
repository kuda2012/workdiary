const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();
const { CLIENT_ID, SECRET_KEY } = require("../config");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const payload = await verifyGoogleToken(req.body.google_access_token).catch(
    console.error
  );
  const token = generateWorksnapAccessToken(payload);
  const doesUserExist = await User.getUser(payload.sub);
  if (!doesUserExist) {
    const newUser = await User.create(payload);
  }
  res.send({ worksnap_token: token });
};

async function verifyGoogleToken(google_access_token) {
  const { payload } = await client.verifyIdToken({
    idToken: google_access_token,
    audience: CLIENT_ID,
  });
  return payload;
}

function generateWorksnapAccessToken(payload) {
  const token = jwt.sign(
    { sub: payload.sub, email: payload.email, name: payload.name },
    SECRET_KEY,
    {
      expiresIn: "2w",
    }
  );
  return token;
}
