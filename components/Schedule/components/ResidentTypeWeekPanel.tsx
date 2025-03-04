import React from "react";
import { View, Text } from "react-native";
import { lightTheme } from "../../../redux/slices/SettingsSlice";
import {
  TypeWeekButton,
  TypeWeekContainer,
  TypeWeekText,
} from "../ScheduleStyle";
import { setCurrentWeekNumberEducator } from "../../../redux/slices/ScheduleEducatorInfoSlice";
import { setCurrentWeekNumberStudent } from "../../../redux/slices/ScheduleStudentInfoSlice";
import { numberWeekFunction } from "../Helpers/scheduleHelpers";
import { setNumberOfSwipes } from "../../../redux/slices/SwipesSlice";
type EducatorWeekType = "resident" | "extramural" | "session";
interface ResidentTypeWeekPanelProps {
  currentTypeWeek: string;
  dataSchedule: any;
  theme: any;
  setTypeWeekToSwitch: (type: string) => void;
  typeWeekToSwitch: string;
  screenWidth: number;
  userType: "student" | "educator";
  setGroupType?: (type: EducatorWeekType) => void; // Обновили тип
  groupType?: EducatorWeekType; // Сделали необязательным
  dispatch: Function;
  setCurrentTypeWeek: any;
  currentWeekNumber: number | null;
  numberOfSwipes: number;
}

const TypeWeekPanel: React.FC<ResidentTypeWeekPanelProps> = ({
  currentTypeWeek,
  dataSchedule,
  theme,
  setTypeWeekToSwitch,
  typeWeekToSwitch,
  screenWidth,
  userType,
  setGroupType,
  groupType,
  dispatch,
  setCurrentTypeWeek,
  currentWeekNumber,
  numberOfSwipes,
}) => {
  const getTextColor = (typeWeek: string) => {
    const isActive =
      userType === "student"
        ? typeWeekToSwitch === typeWeek
        : groupType === typeWeek;
    return theme === lightTheme
      ? isActive
        ? "#FFFFFF"
        : "#FFFFFFB2"
      : isActive
      ? "#004C6F"
      : "#004C6FB2";
  };
  const weekTypes =
    userType === "student"
      ? ["numerator", "denominator", "session"]
      : ["resident", "extramural", "session"];
  return (
    <TypeWeekContainer>
      {weekTypes.map((type) => (
        <View key={type} style={{ flexDirection: "column", flex: 1 }}>
          {userType === "student" && (
            <Text
              style={{
                color: theme.textColor,
                fontSize: screenWidth * 0.04,
                textAlign: "center",
                fontFamily: "Montserrat-SemiBold",
              }}
            >
              {numberWeekFunction(
                type,
                dataSchedule,
                currentTypeWeek,
                currentWeekNumber,
                numberOfSwipes,
                typeWeekToSwitch
              )}
            </Text>
          )}

          <TypeWeekButton
            onPress={() => {
              if (userType === "student") {
                if (type !== "session" && typeWeekToSwitch !== type) {
                  let newWeekNumber = dataSchedule.currentWeekNumber;
                  let newNumberOfSwipes = numberOfSwipes;
                  if (
                    typeWeekToSwitch === "numerator" &&
                    type === "denominator"
                  ) {
                    newWeekNumber += 1;
                    newNumberOfSwipes += 1;
                  } else if (
                    typeWeekToSwitch === "denominator" &&
                    type === "numerator"
                  ) {
                    newWeekNumber -= 1;
                    newNumberOfSwipes -= 1;
                  }
                  dispatch(setCurrentWeekNumberStudent(newWeekNumber));
                  dispatch(setNumberOfSwipes(newNumberOfSwipes));
                }
                setTypeWeekToSwitch(type);
              } else if (
                setGroupType &&
                (type === "resident" ||
                  type === "extramural" ||
                  type === "session")
              ) {
                setGroupType(type); // Устанавливаем тип для educator
              }
            }}
            activeOpacity={0.9}
          >
            <TypeWeekText typeWeek={getTextColor(type)}>
              {type === "numerator" && "Числитель"}
              {type === "denominator" && "Знаменатель"}
              {type === "session" && "Сессия"}
              {type === "resident" && "Очные"}
              {type === "extramural" && "Заочные"}
            </TypeWeekText>
          </TypeWeekButton>
        </View>
      ))}
    </TypeWeekContainer>
  );
};

export default TypeWeekPanel;
