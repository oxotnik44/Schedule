import { FC } from "react";
import { View, Text } from "react-native";
import { ContainerPair, TextSelfStudy } from "../ScheduleStyle";

interface SelfStudyDayProps {
  item: string;
  theme: any; // Желательно заменить на точный тип темы
  lightTheme: any; // Желательно заменить на точный тип темы
  screenWidth: number;
  screenHeight: number;
}

export const SelfStudyDay: FC<SelfStudyDayProps> = ({
  item,
  theme,
  lightTheme,
  screenWidth,
  screenHeight,
}) => {
  return (
    <View key={item}>
      <Text
        style={{
          color: theme.textColor,
          fontSize: screenWidth * 0.06,
          textAlign: "center",
          marginBottom: screenHeight * 0.01,
          fontFamily: "Montserrat-Bold",
        }}
      >
        {item}
      </Text>

      <ContainerPair
        isColorPair={theme === lightTheme ? "#d9d9d999" : "#46464699"}
        style={{
          height: 60,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TextSelfStudy>День самостоятельной работы</TextSelfStudy>
      </ContainerPair>
    </View>
  );
};
