import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Subscription } from "expo-notifications";
export const sendNotification = async (scheduleChanged: any) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Привет! 📬",
      body: "Группы, в которых расписание изменилось: " + scheduleChanged,
    },
    trigger: null, // Уведомление будет отправлено немедленно
  });
};
