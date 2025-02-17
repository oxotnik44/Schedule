import React from "react";
import { FlatList, View, Text } from "react-native";
import moment from "moment";

import { ScheduleInfo } from "./ScheduleInfo";

interface ResidentExtramuralListProps {
  dataSchedule: any;
  screenHeight: number;
  screenWidth: number;
  theme: any;
  lightTheme: any;
  currentDayForExtramuralist: string;
  currentTime: string;
  isConnected: boolean;

  dispatch: any;
  navigation: any;
  isSession: boolean;
  isEducator: boolean;
}

const ExtramuralAndSessionSchedule: React.FC<ResidentExtramuralListProps> = ({
  dataSchedule,
  screenHeight,
  screenWidth,
  theme,
  lightTheme,
  currentDayForExtramuralist,
  currentTime,
  isConnected,

  navigation,
  isSession,
  isEducator,
}) => {
  return (
    <FlatList
      data={isSession ? dataSchedule : dataSchedule.scheduleExtramural}
      keyExtractor={(item, index) => index.toString()}
      initialNumToRender={3}
      maxToRenderPerBatch={10}
      windowSize={10}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: isConnected ? screenHeight * 0 : screenHeight * 0.09,
      }}
      renderItem={({ item, index }) => (
        <View
          key={index}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: isEducator ? screenHeight * 0.03 : 0, // Условный отступ
          }}
        >
          <Text
            style={{
              fontFamily: "Montserrat-Bold",
              color: theme.textColor,
              marginBottom: screenHeight * 0.01,
              fontSize: screenWidth * 0.055,
            }}
          >
            {item.date && item.date}
          </Text>

          <FlatList
            data={item.schedule}
            keyExtractor={(item, index) => item.idPair.toString()}
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            windowSize={10}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              const [start, end] = item.numberPair.split("-");
              const startTime = moment(start, "HH:mm");
              const endTime = moment(end, "HH:mm");

              const isCurrent =
                currentDayForExtramuralist === item.date &&
                moment(currentTime, "HH:mm").isBetween(startTime, endTime);
              const isColorPair = isCurrent;
              return (
                <ScheduleInfo
                  item={item}
                  textColor={theme.textColor}
                  isConnected={isConnected}
                  isCurrent={isCurrent}
                  // Пример использования idPair
                  currentDayForResident={currentDayForExtramuralist}
                  timeArray={start}
                  start={start}
                  navigation={navigation}
                  theme={theme}
                  lightTheme={lightTheme}
                  isColorPair={isColorPair}
                  currentWeekNumber={dataSchedule.currentWeekNumber} // или другое значение для текущей недели
                  isResident={false}
                  isEducator={isEducator}
                />
              );
            }}
          />
        </View>
      )}
    />
  );
};

export default ExtramuralAndSessionSchedule;
