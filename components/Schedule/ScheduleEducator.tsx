import moment from "moment";
import "moment/locale/ru";
import "moment-timezone";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator, View } from "react-native";
import { Dimensions, Text } from "react-native";
import { CenteredContainer, Container, IsSession } from "./ScheduleStyle";
import {
  getFullScheduleEducatorExtramural,
  getScheduleEducator,
  getScheduleEducatorByWeek,
} from "../../api/apiSchedule";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../Navigate";
import { lightTheme } from "../../redux/slices/SettingsSlice";
import { setIsFullScheduleEducator } from "../../redux/slices/ScheduleEducatorInfoSlice";
import useWeekTypeSwitcher from "./hooks/useWeekTypeSwitcher";
import { hasWeekdayInSchedule } from "./Helpers/scheduleHelpers";
import useCurrentDateTime from "./hooks/useCurrentDateTime";
import useScheduleTimeDiff from "./hooks/useScheduleTimeDiff";
import TypeWeekPanel from "./components/ResidentTypeWeekPanel";
import WeekTypeSelector from "./components/WeekTypeSelector";
import { NoConnectionMessage } from "./ui/NoConnectionMessage";
import ResidentScheduleList from "./components/ResidentScheduleList";
import ExtramuralAndSessionSchedule from "./components/ExtramuralAndSessionSchedule";
import useStoredSchedule from "./hooks/useStoredSchedule";
import useFavoriteUpdate from "./hooks/useFavoriteUpdate";
import useLatestEndTime from "./hooks/useLatestEndTime";
import { weekdays } from "./utils/timeUtils";
import ScheduleExtramuralVisibilityToggle from "./components/ScheduleExtramuralVisibilityToggle";
import { useHandleSwipe } from "./hooks/useHandleSwipe";
import { useAppSelector } from "../../redux/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SwipeableContainer from "./components/SwipeableContainer";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

interface IScheduleInfo {
  idPair: number;
  idGroup: number;
  groupName: string;
  comments: string;
  roomNumber: string;
  weekday: string;
  numberPair: string;
  typePair: string;
  namePair: string;

  idEducator: number;
  nameEducator: string;
  nameDepartments: string;
  fullNameEducator: string;
  regaliaEducator: string;
  date: string;
  weeks: string;
}
interface IScheduleExtramuralInfo {
  idPair: number;
  idGroup: number;
  comments: string;
  groupName: string;
  roomNumber: string | null;
  roomName: string;
  numberPair: string;
  typePair: string;
  namePair: string;
  idEducator: number;
  nameDepartments: string;
  nameEducator: string;
  fullNameEducator: string;
  date: string | null;
  typePairRetake: string | null;
}
interface ScheduleState {
  ScheduleInfoEducatorSlice: {
    dataSchedule: {
      lastCacheEntry: {
        currentDateCache: string;
        currentTimeCache: string;
      };
      groupType: string;
      extramuralIsActive: boolean;
      scheduleResident: {
        weekCorrection: number;
        numerator: IScheduleInfo[];
        denominator: IScheduleInfo[];
        session: {
          date: string;
          schedule: IScheduleExtramuralInfo[];
        }[];
      };
      scheduleExtramural: {
        date: string;
        schedule: IScheduleExtramuralInfo[];
      }[];
      currentWeekNumber: string;
    };
    selectIdEducator: number;
    isFullSchedule: boolean;
  };
}

type ScheduleEducatorProps = {
  navigation: StackNavigationProp<RootStackParamList, "ScheduleEducator">;
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
interface FavoriteEducatorsState {
  FavoriteEducatorsSlice: {
    favoriteEducators: { idEducator: number; nameEducator: string }[];
  };
}
const ScheduleEducator = ({ navigation }: ScheduleEducatorProps) => {
  const theme = useSelector((state: ITheme) => state.SettingsSlice.theme);
  const dispatch = useDispatch();
  const isConnected = useSelector(
    (state: Settings) => state.SettingsSlice.isConnected
  );
  moment.tz.setDefault("Asia/Novosibirsk");
  const dataScheduleEducator = useSelector(
    (state: ScheduleState) => state.ScheduleInfoEducatorSlice.dataSchedule
  );
  const nameEducator = useAppSelector(
    (state) => state.EducatorInfoSlice.selectNameEducator
  );
  const selectIdEducator = useSelector(
    (state: ScheduleState) => state.ScheduleInfoEducatorSlice.selectIdEducator
  );

  const isFullSchedule = useSelector(
    (state: ScheduleState) => state.ScheduleInfoEducatorSlice.isFullSchedule
  );
  const [groupType, setGroupType] = useState<
    "resident" | "extramural" | "session"
  >("resident");

  const [typeWeekToSwitch, setTypeWeekToSwitch] = useState("");
  const [currentTypeWeek, setCurrentTypeWeek] = useState<
    "numerator" | "denominator"
  >();
  const [currentDayForResident, setCurrentDayForResident] =
    useState<string>("");
  const [currentDayForExtramuralist, setCurrentDayForExtramuralist] =
    useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");
  let hasWeekday: any = null;
  const resultArray: any[] = [];
  const [timeArray, setTimeArray] = useState("");
  const [timeDifferences, setTimeDifference] = useState<string>("");

  const favoriteEducators = useSelector(
    (state: FavoriteEducatorsState) =>
      state.FavoriteEducatorsSlice.favoriteEducators
  );
  useCurrentDateTime;
  const filteredSchedules = useMemo(() => {
    const filteredSchedule =
      typeWeekToSwitch === "numerator"
        ? dataScheduleEducator.scheduleResident.numerator
        : dataScheduleEducator.scheduleResident.denominator;

    return weekdays.map((weekday) =>
      filteredSchedule.filter(
        (item) => item.weekday === weekday || item.date === weekday
      )
    );
  }, [typeWeekToSwitch, dataScheduleEducator, weekdays]);
  filteredSchedules.forEach((timeFilteredSchedule, index) => {
    timeFilteredSchedule.forEach((scheduleItem) => {
      const [start] = scheduleItem.numberPair.split("-");

      if (scheduleItem.weekday === currentDayForResident) {
        resultArray.push(start);
      }
    });
  });
  hasWeekday = hasWeekdayInSchedule(dataScheduleEducator);
  const { handleSwipe, isLoading, numberOfSwipes } = useHandleSwipe({
    dataSchedule: dataScheduleEducator,
    selectId: selectIdEducator,
    dispatch,
    name: nameEducator,
    getScheduleByWeek: getScheduleEducatorByWeek,
  });
  useWeekTypeSwitcher(
    dataScheduleEducator,
    setCurrentTypeWeek,
    setTypeWeekToSwitch,
    numberOfSwipes
  );

  useCurrentDateTime(
    setCurrentDayForExtramuralist,
    setCurrentDayForResident,
    setCurrentTime,
    weekdays
  );
  useScheduleTimeDiff(
    currentTime,
    resultArray,
    setTimeDifference,
    setTimeArray
  );

  useFavoriteUpdate(
    null,
    null,
    null,
    selectIdEducator,
    favoriteEducators,
    dataScheduleEducator,
    dispatch,
    isConnected
  );

  useStoredSchedule(null, selectIdEducator, isConnected, dispatch);
  const filteredByCurrentDay = useMemo(() => {
    return filteredSchedules.map((item) => {
      return item.filter(
        (schedule) => schedule.weekday === currentDayForResident
      );
    });
  }, [filteredSchedules, currentDayForResident]);
  const latestEndTime = useLatestEndTime(filteredByCurrentDay);
  const dataScheduleSession = dataScheduleEducator.scheduleResident.session;
  return (
    <Container>
      <TypeWeekPanel
        currentTypeWeek={currentTypeWeek}
        dataSchedule={dataScheduleEducator}
        theme={theme}
        setTypeWeekToSwitch={setTypeWeekToSwitch}
        typeWeekToSwitch={typeWeekToSwitch}
        screenWidth={screenWidth}
        userType="educator"
        setGroupType={setGroupType}
        groupType={groupType}
        dispatch={dispatch}
      />

      {groupType === "resident" && (
        <WeekTypeSelector
          currentTypeWeek={currentTypeWeek}
          dataScheduleEducator={dataScheduleEducator}
          setTypeWeekToSwitch={setTypeWeekToSwitch}
          typeWeekToSwitch={typeWeekToSwitch}
          theme={theme}
          screenWidth={screenWidth}
          dispatch={dispatch}
        />
      )}

      {!isConnected && (
        <NoConnectionMessage
          lastCacheEntry={dataScheduleEducator.lastCacheEntry}
        />
      )}
      <GestureHandlerRootView>
        {isLoading ? (
          <View>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Обновление данных...</Text>
          </View>
        ) : (
          groupType === "resident" && (
            <SwipeableContainer onSwipeComplete={handleSwipe}>
              <ResidentScheduleList
                weekdays={weekdays}
                initialFilteredSchedule={filteredSchedules}
                dataSchedule={dataScheduleEducator}
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
                isEducator={true}
              />
            </SwipeableContainer>
          )
        )}
      </GestureHandlerRootView>

      {groupType === "extramural" && (
        <View>
          <ScheduleExtramuralVisibilityToggle
            isFullSchedule={isFullSchedule}
            isConnected={isConnected}
            screenWidth={screenWidth}
            screenHeight={screenHeight}
            theme={theme}
            lightTheme={lightTheme}
            dispatch={dispatch}
            toggleFullSchedule={() =>
              setIsFullScheduleEducator(!isFullSchedule)
            }
            fetchSchedule={() =>
              isFullSchedule
                ? getScheduleEducator(dispatch, selectIdEducator)
                : getFullScheduleEducatorExtramural(dispatch, selectIdEducator)
            }
          />
          <ExtramuralAndSessionSchedule
            dataSchedule={dataScheduleEducator} // Передаем dataSchedule
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
            isEducator={true}
          />
        </View>
      )}

      {groupType === "session" &&
      dataScheduleEducator.scheduleResident.session.length !== 0 ? (
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
          {groupType === "session" && (
            <CenteredContainer>
              <IsSession>Сессия ещё не началась</IsSession>
            </CenteredContainer>
          )}
        </View>
      )}
    </Container>
  );
};

export default ScheduleEducator;
