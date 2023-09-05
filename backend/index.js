const express = require("express");
const { OAuth2Client } = require("google-auth-library");
var cors = require("cors");
var bodyParser = require("body-parser");
const app = express();
app.use(cors());
const port = process.env.PORT || 3000;
const client = new OAuth2Client();
// Use the provided port or default to 3000

// Define a route for the root URL

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Hello, World!"); // Send a simple response
});

app.post("/", async (req, res) => {
  let payload;
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: req.body.token,
      audience:
        "217103780375-7ehtve0hmkbc08uf0alv01pnehsv7tlf.apps.googleusercontent.com", // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    payload = ticket.payload;
    const userid = payload["sub"];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
  }
  await verify().catch(console.error);
  res.send({ payload });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
