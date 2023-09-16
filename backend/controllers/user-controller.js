const axios = require("axios");
const { SECRET_KEY } = require("../config");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const payload = await verifyGoogleToken(req.body.google_access_token);
  const token = generateWorksnapAccessToken(payload);
  const doesUserExist = await User.getUser(payload.sub);
  if (!doesUserExist) {
    await User.create(payload);
  }
  res.send({ worksnap_token: token });
};

async function verifyGoogleToken(google_access_token) {
  // Verifies the access token
  const { data } = await axios.get(
    `https://oauth2.googleapis.com/tokeninfo?access_token=${google_access_token}`
  );
  // adding a name to the payload
  const getInfo = await axios.get(
    `https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses&access_token=${google_access_token}`
  );
  data.name = getInfo.data.names[0].displayName;
  return data;
}

function generateWorksnapAccessToken(payload) {
  const token = jwt.sign(
    { id: payload.sub, email: payload.email, name: payload.name },
    SECRET_KEY,
    {
      expiresIn: "2w",
    }
  );
  return token;
}
