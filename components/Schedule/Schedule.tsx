import "moment/locale/ru";
import "moment-timezone";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View } from "react-native";
import { Dimensions } from "react-native";
import {
  CenteredContainer,
  Container,
  IsSession,
  ScheduleCloseView,
} from "./ScheduleStyle";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../Navigate";
import {
  getFullScheduleStudentExtramuralist,
  getSchedule,
} from "../../api/apiSchedule";
import { lightTheme } from "../../redux/slices/SettingsSlice";
import { ThemeProvider } from "styled-components/native";
import { ScheduleState } from "./types/sheduleStudentTypes";
import useWeekTypeSwitcher from "./hooks/useWeekTypeSwitcher";
import useCurrentDateTime from "./hooks/useCurrentDateTime";
import useScheduleTimeDiff from "./hooks/useScheduleTimeDiff";
import useStoredSchedule from "./hooks/useStoredSchedule";
import { weekdays } from "./utils/timeUtils";
import { fetchScheduleEducator } from "./api/educatorApi";
import { hasWeekdayInSchedule } from "./Helpers/scheduleHelpers";
import { NoConnectionMessage } from "./ui/NoConnectionMessage";

import ResidentScheduleList from "./components/ResidentScheduleList";
import ScheduleExtramuralVisibilityToggle from "./components/ScheduleExtramuralVisibilityToggle";
import ExtramuralAndSessionSchedule from "./components/ExtramuralAndSessionSchedule";
import TypeWeekPanel from "./components/ResidentTypeWeekPanel";
import moment from "moment";
import useFavoriteUpdate from "./hooks/useFavoriteUpdate";
import useLatestEndTime from "./hooks/useLatestEndTime";
import { setIsExtramuralScheduleUntilTodayStudent } from "../../redux/slices/ScheduleStudentInfoSlice";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

interface FavoriteGroupsState {
  FavoriteGroupsSlice: {
    favoriteGroups: { idGroup: number; nameGroup: string }[];
  };
}
// Тип ScheduleProps
type ScheduleProps = {
  navigation: StackNavigationProp<RootStackParamList, "Schedule">;
};
type ITheme = {
  SettingsSlice: {
    theme: any;
  };
};
interface Settings {
  SettingsSlice: {
    isConnected: boolean;
  };
}
interface Namegroup {
  GroupsInfoSlice: {
    selectedGroupName: string;
  };
}

const Schedule = ({ navigation }: ScheduleProps) => {
  const theme = useSelector((state: ITheme) => state.SettingsSlice.theme);
  const isConnected = useSelector(
    (state: Settings) => state.SettingsSlice.isConnected
  );
  const { dataSchedule, selectIdGroup, isExtramuralScheduleUntilToday } =
    useSelector((state: ScheduleState) => state.ScheduleInfoStudentSlice);

  const groupType = dataSchedule.groupType;
  const dataScheduleSession = dataSchedule.scheduleResident.session;

  const favoriteGroups = useSelector(
    (state: FavoriteGroupsState) => state.FavoriteGroupsSlice.favoriteGroups
  );

  const nameGroup = useSelector(
    (state: Namegroup) => state.GroupsInfoSlice.selectedGroupName
  );

  let hasWeekday: any = null;

  const dispatch = useDispatch();

  const [typeWeekToSwitch, setTypeWeekToSwitch] = useState("");
  const [currentTypeWeek, setCurrentTypeWeek] = useState<
    "numerator" | "denominator" | "session"
  >();
  const [currentDayForResident, setCurrentDayForResident] =
    useState<string>("Понедельник");
  const [currentDayForExtramuralist, setCurrentDayForExtramuralist] =
    useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [timeArray, setTimeArray] = useState("");
  const [timeDifferences, setTimeDifference] = useState<string>("");
  const arrayStartsPairs: any[] = [];
  useWeekTypeSwitcher(dataSchedule, setCurrentTypeWeek, setTypeWeekToSwitch);
  useCurrentDateTime(
    setCurrentDayForExtramuralist,
    setCurrentDayForResident,
    setCurrentTime,
    weekdays
  );
  useScheduleTimeDiff(
    currentTime,
    arrayStartsPairs,
    setTimeDifference,
    setTimeArray
  );
  useFavoriteUpdate(
    selectIdGroup,
    favoriteGroups,
    dataSchedule,
    null,
    null,
    null,
    dispatch,
    isConnected
  );
  useStoredSchedule(selectIdGroup, null, isConnected, dispatch);

  const currentWeekSchedule = dataSchedule.scheduleResident[typeWeekToSwitch];

  const initialFilteredSchedule = useMemo(() => {
    return (weekdays || []).map((weekday) =>
      (currentWeekSchedule || []).filter((item) =>
        [item.weekday, item.date].includes(weekday)
      )
    );
  }, [currentWeekSchedule, weekdays]);
  initialFilteredSchedule.flat().forEach(({ numberPair, weekday }) => {
    if (weekday === currentDayForResident)
      arrayStartsPairs.push(numberPair?.split("-")[0] || "");
  });

  hasWeekday = hasWeekdayInSchedule(dataSchedule);
  const latestEndTime = useLatestEndTime(initialFilteredSchedule);
  return (
    <ThemeProvider theme={theme}>
      <Container>
        {groupType === "resident" && (
          <TypeWeekPanel
            currentTypeWeek={currentTypeWeek}
            dataSchedule={dataSchedule}
            theme={theme}
            setTypeWeekToSwitch={setTypeWeekToSwitch}
            typeWeekToSwitch={typeWeekToSwitch}
            screenWidth={screenWidth}
            userType="student"
          />
        )}

        {!isConnected && (
          <NoConnectionMessage lastCacheEntry={dataSchedule.lastCacheEntry} />
        )}

        {groupType === "resident" && typeWeekToSwitch !== "session" && (
          <ResidentScheduleList
            weekdays={weekdays}
            initialFilteredSchedule={initialFilteredSchedule}
            dataSchedule={dataSchedule}
            currentDayForResident={currentDayForResident}
            currentTime={currentTime}
            hasWeekday={hasWeekday}
            isConnected={isConnected}
            timeArray={timeArray}
            timeDifferences={timeDifferences}
            navigation={navigation}
            theme={theme}
            lightTheme={lightTheme}
            screenWidth={screenWidth}
            screenHeight={screenHeight}
            latestEndTime={latestEndTime}
          />
        )}
        {groupType !== "resident" &&
        groupType !== "session" &&
        dataSchedule.extramuralIsActive ? (
          <View>
            <ScheduleExtramuralVisibilityToggle
              isFullSchedule={isExtramuralScheduleUntilToday} // Изменили название пропса
              isConnected={isConnected}
              screenWidth={screenWidth}
              screenHeight={screenHeight}
              theme={theme}
              lightTheme={lightTheme}
              dispatch={dispatch}
              toggleFullSchedule={() =>
                setIsExtramuralScheduleUntilTodayStudent(
                  !isExtramuralScheduleUntilToday
                )
              }
              fetchSchedule={() =>
                isExtramuralScheduleUntilToday
                  ? getSchedule(selectIdGroup, dispatch, nameGroup, false)
                  : getFullScheduleStudentExtramuralist(dispatch, selectIdGroup)
              }
            />

            <ExtramuralAndSessionSchedule
              dataSchedule={dataSchedule} // Передаем dataSchedule
              screenHeight={screenHeight} // Передаем screenHeight
              screenWidth={screenWidth} // Передаем screenWidth
              theme={theme} // Передаем theme
              lightTheme={lightTheme} // Передаем lightTheme
              currentDayForExtramuralist={currentDayForExtramuralist} // Передаем currentDayForExtramuralist
              currentTime={currentTime} // Передаем currentTime
              isConnected={isConnected} // Передаем isConnected
              dispatch={dispatch} // Передаем dispatch
              navigation={navigation} // Передаем navigation
              isSession={false}
              isEducator={false}
            />
          </View>
        ) : (
          <View>
            {groupType !== "resident" && typeWeekToSwitch !== "session" && (
              <CenteredContainer>
                <ScheduleCloseView>
                  Расписание этой группы закрыто для просмотра (как правило, так
                  бывает во время формирования расписания на следующий семестр).
                </ScheduleCloseView>
              </CenteredContainer>
            )}
          </View>
        )}
        {typeWeekToSwitch === "session" &&
        dataSchedule.scheduleResident.session.length !== 0 ? (
          <ExtramuralAndSessionSchedule
            dataSchedule={dataScheduleSession} // Передаем dataSchedule
            screenHeight={screenHeight} // Передаем screenHeight
            screenWidth={screenWidth} // Передаем screenWidth
            theme={theme} // Передаем theme
            lightTheme={lightTheme} // Передаем lightTheme
            currentDayForExtramuralist={currentDayForExtramuralist} // Передаем currentDayForExtramuralist
            currentTime={currentTime} // Передаем currentTime
            isConnected={isConnected} // Передаем isConnected
            dispatch={dispatch} // Передаем dispatch
            navigation={navigation} // Передаем navigation
            isSession={true}
            isEducator={false}
          />
        ) : (
          <View>
            {typeWeekToSwitch === "session" && (
              <CenteredContainer>
                <IsSession>Сессия ещё не началась</IsSession>
              </CenteredContainer>
            )}
          </View>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default Schedule;
