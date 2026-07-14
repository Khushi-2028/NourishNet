import { getMessaging } from "../config/firebase.js";

const sendPushNotification = async (
  token,
  title,
  body,
  data = {}
) => {

  // Skip if device token is missing
  if (!token) {

    console.log("Device token not found. Notification skipped.");

    return;

  }

  try {

    await getMessaging().send({

      token,

      notification: {

        title,

        body

      },

      data

    });

    console.log("Push notification sent successfully.");

  }

  catch (error) {

    console.log("Push Notification Error:");

    console.log(error.message);

  }

};

export default sendPushNotification;