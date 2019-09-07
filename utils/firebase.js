const admin = require("firebase-admin");

const serviceAccount = require("../config/firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL|| "https://<DATABASE_NAME>.firebaseio.com"
});

module.exports = admin