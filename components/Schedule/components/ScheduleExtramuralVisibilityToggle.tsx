import React from "react";
import { View, Text, ToastAndroid } from "react-native";
import { setIsExtramuralScheduleUntilTodayStudent } from "../../../redux/slices/ScheduleStudentInfoSlice";
import { BtnGetScheduleExtramural } from "../ScheduleStyle";

interface ScheduleVisibilityToggleProps {
  isExtramuralScheduleUntilToday: boolean;
  isConnected: boolean;
  screenWidth: number;
  screenHeight: number;
  theme: any;
  lightTheme: any;
  selectIdGroup: number; // selectIdGroup теперь число
  dispatch: any;
  nameGroup: string;
  getSchedule: (
    idGroup: number, // idGroup теперь число
    dispatch: any,
    nameGroup: string,
    isUntilToday: boolean
  ) => Promise<void>;
  getFullScheduleStudentExtramuralist: (
    dispatch: any,
    selectIdGroup: number // selectIdGroup теперь число
  ) => Promise<void>;
}

const ScheduleExtramuralVisibilityToggle: React.FC<
  ScheduleVisibilityToggleProps
> = ({
  isExtramuralScheduleUntilToday,
  isConnected,
  screenWidth,
  screenHeight,
  theme,
  lightTheme,
  selectIdGroup,
  dispatch,
  nameGroup,
  getSchedule,
  getFullScheduleStudentExtramuralist,
}) => {
  const handleButtonPress = async () => {
    if (!isConnected) {
      ToastAndroid.show("Нет соединения с интернетом", ToastAndroid.SHORT);
    } else {
      if (isExtramuralScheduleUntilToday) {
        await getFullScheduleStudentExtramuralist(dispatch, selectIdGroup);
      } else {
        await getSchedule(selectIdGroup, dispatch, nameGroup, false); // передаем selectIdGroup как число
      }
      dispatch(
        setIsExtramuralScheduleUntilTodayStudent(
          !isExtramuralScheduleUntilToday
        )
      );
    }
  };

  return (
    <View
      style={{ paddingHorizontal: screenWidth * 0.04, alignItems: "center" }}
    >
      <Text
        style={{
          fontFamily: "Montserrat-Bold",
          color: theme.textColor,
          marginTop: screenHeight * 0.01,
          fontSize: screenWidth * 0.04,
        }}
      >
        {isExtramuralScheduleUntilToday
          ? "Что бы скрыть прошедшие пары нажмите"
          : "Скрыты уже прошедшие занятия. Чтобы увидеть расписание ранее сегодняшней даты нажмите"}
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
