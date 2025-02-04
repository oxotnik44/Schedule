import React from "react";
import { View, Text, ToastAndroid } from "react-native";
import { BtnGetScheduleExtramural } from "../ScheduleStyle";

interface ScheduleVisibilityToggleProps {
  isFullSchedule: boolean;
  isConnected: boolean;
  screenWidth: number;
  screenHeight: number;
  theme: any;
  lightTheme: any;
  dispatch: any;
  toggleFullSchedule: () => void;
  fetchSchedule: () => Promise<void>;
}

const ScheduleExtramuralVisibilityToggle: React.FC<
  ScheduleVisibilityToggleProps
> = ({
  isFullSchedule,
  isConnected,
  screenWidth,
  screenHeight,
  theme,
  lightTheme,
  dispatch,
  toggleFullSchedule,
  fetchSchedule,
}) => {
  const handleButtonPress = async () => {
    if (!isConnected) {
      ToastAndroid.show("Нет соединения с интернетом", ToastAndroid.SHORT);
      return;
    }
    await fetchSchedule();
    dispatch(toggleFullSchedule());
  };

  return (
    <View
      style={{ paddingHorizontal: screenWidth * 0.05, alignItems: "center" }}
    >
      <Text
        style={{
          fontFamily: "Montserrat-Bold",
          color: theme.textColor,
          marginTop: screenHeight * 0.01,
          fontSize: screenWidth * 0.04,
        }}
      >
        {isFullSchedule
          ? "Чтобы скрыть прошедшие пары, нажмите"
          : "Скрыты уже прошедшие занятия. Чтобы увидеть расписание ранее сегодняшней даты, нажмите"}
      </Text>
      <BtnGetScheduleExtramural onPress={handleButtonPress}>
        <Text
          style={{
            fontSize: screenWidth * 0.04,
            color: theme === lightTheme ? "#FFFFFF" : "#004C6F",
            fontFamily: "Montserrat-SemiBold",
            textAlign: "center",
          }}
        >
          Здесь
        </Text>
      </BtnGetScheduleExtramural>
    </View>
  );
};

export default ScheduleExtramuralVisibilityToggle;
