import React from "react";
import { View, Text } from "react-native";
import { lightTheme } from "../../../redux/slices/SettingsSlice";
import {
  TypeWeekButton,
  TypeWeekContainer,
  TypeWeekText,
} from "../ScheduleStyle";

interface FractionWeekPanelProps {
  currentTypeWeek: string;
  dataScheduleEducator: any;
  setTypeWeekToSwitch: (type: string) => void;
  typeWeekToSwitch: string;
  theme: any;
  screenWidth: number;
}

const WeekTypeSelector: React.FC<FractionWeekPanelProps> = ({
  currentTypeWeek,
  dataScheduleEducator,
  setTypeWeekToSwitch,
  typeWeekToSwitch,
  theme,
  screenWidth,
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
          fontSize: screenWidth * 0.0424,
          textAlign: "center",
          fontFamily: "Montserrat-SemiBold",
        }}
      >
        {currentTypeWeek === type &&
          `Текущая № ${dataScheduleEducator.currentWeekNumber}`}
      </Text>
      <TypeWeekButton
        onPress={() => setTypeWeekToSwitch(type)}
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
