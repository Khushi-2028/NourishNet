import { initializeApp, cert } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

import serviceAccount from "../firebase-key.json" with { type: "json" };

const app = initializeApp({

    credential: cert(serviceAccount)

});

export { app, getMessaging };