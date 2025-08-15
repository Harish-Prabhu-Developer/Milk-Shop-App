// fcmService.js
import admin from "../Config/firebaseConfig.js";

// Send notification to a single device
export const sendNotification = async (token, title, body, data = {}) => {
  try {
    const message = {
      token,
      notification: { title, body },
      data, // custom payload (optional)
    };

    const response = await admin.messaging().send(message);
    console.log("✅ Notification sent:", response);
    return response;
  } catch (error) {
    console.error("❌ Error sending notification:", error);
    throw error;
  }
};

// Send notification to multiple devices
export const sendNotificationToMany = async (tokens, title, body, data = {}) => {
  try {
    const message = {
      tokens,
      notification: { title, body },
      data,
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    console.log("✅ Notifications sent:", response.successCount);
    return response;
  } catch (error) {
    console.error("❌ Error sending to many:", error);
    throw error;
  }
};
