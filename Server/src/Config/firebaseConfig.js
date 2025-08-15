import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT)),
});

export default admin;
