import React, { useState } from "react";
import { View, Text, FlatList } from "react-native";
import moment from "moment";
import { SelfStudyDay } from "../ui/SelfStudyDay";
import { ScheduleInfo } from "./ScheduleInfo";

interface Props {
  weekdays: string[];
  initialFilteredSchedule: any[];
  dataSchedule: any;
  currentDayForResident: string;
  currentTime: string;
  hasWeekday: boolean;
  isConnected: boolean;
  timeArray: any;
  timeDifferences: any;
  navigation: any;
  theme: any;
  lightTheme: any;
  screenWidth: number;
  screenHeight: number;
  latestEndTime: moment.Moment;
  isEducator: boolean;
}

const ResidentScheduleList: React.FC<Props> = ({
  weekdays,
  initialFilteredSchedule,
  dataSchedule,
  currentDayForResident,
  currentTime,
  hasWeekday,
  isConnected,
  timeArray,
  timeDifferences,
  navigation,
  theme,
  lightTheme,
  screenWidth,
  screenHeight,
  latestEndTime,
  isEducator,
}) => {
  return (
    <FlatList
      data={weekdays}
      keyExtractor={(item, index) => index.toString()}
      initialNumToRender={3}
      maxToRenderPerBatch={5}
      windowSize={10}
      showsVerticalScrollIndicator={false}
      renderItem={({ item, index }) => {
        const timeFilteredSchedule = initialFilteredSchedule[index];
        const matchingIdPairs: string[] = [];
        if (timeFilteredSchedule.length === 0) {
          return (
            <SelfStudyDay
              item={item}
              theme={theme}
              lightTheme={lightTheme}
              screenWidth={screenWidth}
              screenHeight={screenHeight}
            />
          );
        }
        timeFilteredSchedule.forEach(({ weeks, idPair }: any) => {
          if (!weeks) return;

          weeks
            .trim()
            .split(/(?=\()/)
            .forEach((week: string) => {
              // Обработка диапазонов, например "27-29"
              const [start, end] =
                week
                  .match(/\d+-\d+/)?.[0]
                  .split("-")
                  .map(Number) || [];

              // Обработка одиночных недель, например "27, 30"
              const singleWeeks = week.match(/\d+/g);

              if (singleWeeks) {
                singleWeeks.forEach((weekNumber) => {
                  if (+dataSchedule.currentWeekNumber === Number(weekNumber)) {
                    matchingIdPairs.push(idPair);
                  }
                });
              }

              // Проверка диапазонов
              if (
                start &&
                end && // Если это диапазон
                +dataSchedule.currentWeekNumber >= start &&
                +dataSchedule.currentWeekNumber <= end
              ) {
                matchingIdPairs.push(idPair);
              }
            });
        });

        return (
          <View key={item}>
            <Text
              style={{
                fontSize: screenWidth * 0.06,
                textAlign: "center",
                color: theme.textColor,
                marginBottom: screenHeight * 0.01,
                fontFamily: "Montserrat-Bold",
              }}
            >
              {item}
            </Text>
            <FlatList
              data={timeFilteredSchedule}
              keyExtractor={(item) => item.idPair.toString()}
              initialNumToRender={6}
              maxToRenderPerBatch={5}
              windowSize={10}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const [start, end] = item.numberPair.split("-");
                const startTime = moment(start, "HH:mm");
                const endTime = moment(end, "HH:mm");
                const isCurrent =
                  currentDayForResident ===
                    (hasWeekday ? item.weekday : item.date) &&
                  moment(currentTime, "HH:mm:ss").isBetween(
                    startTime,
                    endTime,
                    null,
                    "[]"
                  );
                const formattedTimeDifference = moment
                  .utc(endTime.diff(moment(currentTime, "HH:mm:ss")))
                  .format("HH:mm:ss")
                  .padStart(8, "0");
                const textColorInner =
                  !item.weeks ||
                  item.weeks.trim() === "" ||
                  matchingIdPairs.includes(item.idPair)
                    ? theme.textColor
                    : theme === lightTheme
                    ? "#a0a0a0"
                    : "#606060";
                return (
                  <ScheduleInfo
                    item={item}
                    textColor={textColorInner}
                    isConnected={isConnected}
                    isCurrent={isCurrent}
                    matchingIdPairs={matchingIdPairs}
                    currentDayForResident={currentDayForResident}
                    timeArray={timeArray}
                    start={start}
                    formattedTimeDifference={formattedTimeDifference}
                    timeDifferences={timeDifferences}
                    navigation={navigation}
                    theme={theme}
                    lightTheme={lightTheme}
                    isColorPair={isCurrent}
                    currentWeekNumber={+dataSchedule.currentWeekNumber}
                    isResident={true}
                    isEducator={isEducator}
                    currentTime={currentTime}
                    latestEndTime={latestEndTime}
                  />
                );
              }}
            />
          </View>
        );
      }}
    />
  );
};

export default ResidentScheduleList;
