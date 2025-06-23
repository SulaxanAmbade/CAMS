const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // put this file in /config

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
