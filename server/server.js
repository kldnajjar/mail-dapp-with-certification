const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
let Gun = require("gun");
const SEA = require("gun/sea");
// const corsOptions = require("./src/configs/corsOrigin/corsOptions");

// implements forked version of bullet catcher with
// additional error handling
require("bullet-catcher");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8765;
const APP_KEY_PAIR = JSON.parse(process.env.APP_KEY_PAIR);
const APP_TOKEN_SECRET = process.env.APP_TOKEN_SECRET;

app.use(Gun.serve);

const server = app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

// verify JWT from gun message
function verifyToken(msg) {
  if (msg?.headers?.accessToken) {
    try {
      jwt.verify(msg.headers.accessToken, APP_TOKEN_SECRET);
      console.log("valid token");

      return true;
    } catch (err) {
      const error = new Error("Invalid access token");

      if (err.name === "TokenExpiredError") {
        // you might want to implement silent refresh here
        error.expiredAt = err.expiredAt;
      }

      console.log("Incorrect Token", error);
      return error;
    }
  }

  // console.log("Token object is missing");
  return false;
}

const gun = Gun({
  web: server,
  peers: [
    "https://mykmail-server-usa.herokuapp.com/gun",
    "https://mykmail-server-eu.herokuapp.com/gun",
  ],
  // verify: {
  //   check: function () {
  //     console.log("PEER CONNECTED!!");
  //     return true;
  //   },
  // },
  isValid: verifyToken,
});

// Sync everything
gun.on("out", { get: { "#": { "*": "" } } });

// Authorize this app as a user
gun.user().auth(APP_KEY_PAIR, ({ err }) => {
  // TODO handle app auth error
  if (err) {
    console.error(err);
  }
});

// parse application/json
app.use(express.json());

// if you're allowing gun access to more than one http origin,
// you'll want to make sure that CORs for API routes is configured
app.use(cors());

app.post("/api/certificates", async (req, res) => {
  const { email, pub: userPubKey } = req.body;

  // See https://gun.eco/docs/SEA.certify for policies
  const policy = [
    // allow users to add and edit their profiles with:
    //   gun
    //     .get('~'+app.pub)
    //     .get('profiles')
    //     .get(user.pub)
    //     .put({ name: 'alice' }, null, {opt: { cert: certificate }} )
    { "*": "profiles", "+": "*" },
  ];

  // expire in 2 hours
  const expiresAt = Date.now() + 60 * 60 * 1000 * 2;

  // if (!email) return;

  const certificate = await SEA.certify(
    [userPubKey],
    policy,
    APP_KEY_PAIR,
    ({ err }) => {
      if (err) {
        console.log(`Error creating certificate for ${email}:`, err);
      } else {
        console.log(`Successfully created certificate for ${email}`);
      }
    },
    // FIXME neither expiry or block seem to be working?
    // https://github.com/amark/gun/issues/1143
    {
      // expiry: expiresAt,
      // // name of path to blocked/banned users
      // block: 'blocked',
    }
  );

  res.status(201).send({
    certificate,
    expires_at: expiresAt,
  });
});

app.post("/api/tokens", async (req, res) => {
  const { email, pub } = req.body;

  const token = jwt.sign({ email, pub }, APP_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  res.status(201).send({
    accessToken: token,
  });
});
