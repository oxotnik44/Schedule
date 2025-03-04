import React from "react";
import { View, Text } from "react-native";
import { lightTheme } from "../../../redux/slices/SettingsSlice";
import {
  TypeWeekButton,
  TypeWeekContainer,
  TypeWeekText,
} from "../ScheduleStyle";
import { setCurrentWeekNumberEducator } from "../../../redux/slices/ScheduleEducatorInfoSlice";
import { numberWeekFunction } from "../Helpers/scheduleHelpers";
import { setCurrentWeekNumberStudent } from "../../../redux/slices/ScheduleStudentInfoSlice";
import { setNumberOfSwipes } from "../../../redux/slices/SwipesSlice";

interface FractionWeekPanelProps {
  currentTypeWeek: string;
  dataScheduleEducator: any;
  setTypeWeekToSwitch: (type: string) => void;
  typeWeekToSwitch: string;
  theme: any;
  screenWidth: number;
  dispatch: Function;
  setCurrentTypeWeek: any;
  currentWeekNumber: number | null;
  numberOfSwipes: number;
}

const WeekTypeSelector: React.FC<FractionWeekPanelProps> = ({
  currentTypeWeek,
  dataScheduleEducator,
  setTypeWeekToSwitch,
  typeWeekToSwitch,
  theme,
  screenWidth,
  dispatch,
  setCurrentTypeWeek,
  currentWeekNumber,
  numberOfSwipes,
}) => {
  const getTextColor = (type: string) => {
    return theme === lightTheme
      ? typeWeekToSwitch === type
        ? "#FFFFFF"
        : "#FFFFFFB2"
      : typeWeekToSwitch === type
      ? "#004C6F"
      : "#004C6FB2";
  };

  const renderWeekType = (type: string, label: string) => (
    <View style={{ flexDirection: "column", flex: 1 }}>
      <Text
        style={{
          color: theme === lightTheme ? "#004C6F" : "#FFFFFF",
          fontSize: screenWidth * 0.04,
          textAlign: "center",
          fontFamily: "Montserrat-SemiBold",
        }}
      >
        {numberWeekFunction(
          type,
          dataScheduleEducator,
          currentTypeWeek,
          currentWeekNumber,
          numberOfSwipes,
          typeWeekToSwitch
        )}
      </Text>
      <TypeWeekButton
        onPress={() => {
          if (typeWeekToSwitch !== type) {
            let newWeekNumber = dataScheduleEducator.currentWeekNumber;
            let newNumberOfSwipes = numberOfSwipes;
            if (typeWeekToSwitch === "numerator" && type === "denominator") {
              newWeekNumber += 1;
              newNumberOfSwipes += 1;
            } else if (
              typeWeekToSwitch === "denominator" &&
              type === "numerator"
            ) {
              newWeekNumber -= 1;
              newNumberOfSwipes -= 1;
            }
            dispatch(setCurrentWeekNumberEducator(newWeekNumber));
            dispatch(setNumberOfSwipes(newNumberOfSwipes));
            setTypeWeekToSwitch(type);
          }
        }}
        activeOpacity={0.9}
      >
        <TypeWeekText typeWeek={getTextColor(type)}>{label}</TypeWeekText>
      </TypeWeekButton>
    </View>
  );

  return (
    <TypeWeekContainer>
      {renderWeekType("numerator", "Числитель")}
      {renderWeekType("denominator", "Знаменатель")}
    </TypeWeekContainer>
  );
};

export default WeekTypeSelector;
