import { FC } from "react";
import { View } from "react-native";
import { CommentText } from "./CommentText";
import { WeekHighlight } from "./WeekHighlight";
import { PairItem } from "./PairItem";
import { ContainerPair, TextNamePair } from "../ScheduleStyle";

interface ScheduleCardProps {
  item: any; // Желательно заменить `any` на точный тип данных
  textColor: string;
  isConnected: boolean;
  isCurrent: boolean;
  matchingIdPairs?: any[]; // Желательно указать точный тип
  currentDayForResident: string;
  timeArray: string;
  start: string;
  formattedTimeDifference?: string;
  timeDifferences?: string;
  navigation: any; // Указать точный тип для React Navigation
  theme: any; // Желательно заменить на точный тип темы
  lightTheme: any; // Желательно заменить на точный тип темы
  isColorPair: boolean;
  currentWeekNumber: number;
  isResident: boolean;
  isEducator: boolean;
  currentTime?: string;
  latestEndTime?: moment.Moment;
}

export const ScheduleInfo: FC<ScheduleCardProps> = ({
  item,
  textColor,
  isConnected,
  isCurrent,
  matchingIdPairs,
  currentDayForResident,
  timeArray,
  start,
  formattedTimeDifference,
  timeDifferences,
  navigation,
  theme,
  lightTheme,
  isColorPair,
  currentWeekNumber,
  isResident,
  isEducator,
  currentTime,
  latestEndTime,
}) => {
  const backgroundColor =
    !item.weeks ||
    item.weeks.trim() === "" ||
    matchingIdPairs.includes(item.idPair)
      ? theme === lightTheme
        ? isColorPair
          ? "#C3C9DE"
          : "#d9d9d999"
        : isColorPair
        ? "#4B61B0"
        : "#46464699"
      : "transparent";

  return (
    <View key={item.idPair} style={{ alignItems: "center" }}>
      <ContainerPair isColorPair={backgroundColor}>
        <TextNamePair ellipsizeMode="tail" style={{ color: textColor }}>
          {item.namePair}
        </TextNamePair>

        <PairItem
          item={item}
          textColor={textColor}
          isConnected={isConnected}
          isCurrent={isCurrent}
          matchingIdPairs={matchingIdPairs}
          currentDayForResident={currentDayForResident}
          timeArray={timeArray}
          start={start}
          formattedTimeDifference={formattedTimeDifference}
          timeDifferences={timeDifferences}
          navigation={navigation}
          isResident={isResident}
          isEducator={isEducator}
          currentTime={currentTime}
          latestEndTime={latestEndTime}
        />

        <CommentText comment={item.comments} textColor={textColor} />

        <WeekHighlight
          weeks={item.weeks}
          currentWeekNumber={currentWeekNumber}
          theme={theme}
          lightTheme={lightTheme}
        />
      </ContainerPair>
    </View>
  );
};
