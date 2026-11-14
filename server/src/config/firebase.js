
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import fs from "fs";

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Render: load credentials from environment variable
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // Local development: load the existing JSON file
  const serviceAccountPath = new URL("../firebase-key.json", import.meta.url);
  serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
}

const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert(serviceAccount),
      });

export { app, getMessaging };
