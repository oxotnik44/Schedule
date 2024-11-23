import moment from "moment";
import "moment/locale/ru";
import "moment-timezone";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
  Linking,
} from "react-native";
import { Dimensions } from "react-native";
import {
  BtnGetScheduleExtramural,
  CenteredContainer,
  CommentsText,
  Container,
  ContainerLeft,
  ContainerPair,
  ContainerRight,
  DateText,
  IsSession,
  NoConnected,
  ScheduleCloseView,
  TextNameEducator,
  TextNameGroup,
  TextNamePair,
  TextNumberPair,
  TextRoomNumber,
  TextSelfStudy,
  TextTypePair,
  TimeToLesson,
  TypeWeekButton,
  TypeWeekContainer,
  TypeWeekText,
} from "./ScheduleStyle";
import { setNameEducator } from "../../redux/slices/EducatorSlice";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../Navigate";
import {
  getFullScheduleStudentExtramuralist,
  getSchedule,
  getScheduleEducator,
} from "../../api/apiSchedule";
import { lightTheme } from "../../redux/slices/SettingsSlice";
import { ThemeProvider } from "styled-components/native";
import { setSelectIdEducator } from "../../redux/slices/ScheduleEducatorInfoSlice";
import {
  setIsExtramuralScheduleUntilTodayStudent,
  setLastCacheEntryStudent,
} from "../../redux/slices/ScheduleStudentInfoSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setFavoriteSchedule } from "../../redux/slices/FavoritesSlice/FavoriteScheduleStudent";
import { useNetInfo } from "@react-native-community/netinfo";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

interface IScheduleInfo {
  idPair: number;
  comments: string;
  roomNumber: string;
  weekday: string;
  nameGroup: string;
  numberPair: string;
  typePair: string;
  namePair: string;
  idEducator: number;
  nameEducator: string;
  fullNameEducator: string;
  regaliaEducator: string;
  date: string;
  weeks: string;
}
interface IScheduleExtramuralInfo {
  idPair: number;
  weekday: string;
  comments: string;
  nameGroup: string;
  roomNumber: string | null;
  numberPair: string;
  typePair: string;
  namePair: string;
  roomName: string;
  typePairRetake: string;
  idEducator: number;
  nameEducator: string;
  fullNameEducator: string;
  regaliaEducator: string;
  date: string | null;
  weeks: string;
}
interface ScheduleState {
  ScheduleInfoStudentSlice: {
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
    selectIdGroup: number;
    isExtramuralScheduleUntilToday: boolean;
  };
}
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
moment.tz.setDefault("Asia/Novosibirsk");
const weekdays = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];
const STORAGE_KEY_SCHEDULE = "favoriteSchedule";

const formatTime = (timeDiff) => {
  const hours = String(Math.floor(timeDiff / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((timeDiff % 3600) / 60)).padStart(2, "0");
  const seconds = String(timeDiff % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

const updateFavoriteGroup = async (
  idGroup,
  favoriteGroups,
  dataSchedule,
  dispatch
) => {
  try {
    const storedSchedule = await AsyncStorage.getItem(STORAGE_KEY_SCHEDULE);
    let scheduleStudent = storedSchedule
      ? JSON.parse(storedSchedule)
      : { groups: [], educators: [] };

    const isFavoriteGroup = favoriteGroups.some(
      (groupFavorite) => groupFavorite.idGroup === idGroup
    );
    const isFavoriteScheduleGroup = scheduleStudent.groups.some((group) =>
      group.hasOwnProperty(idGroup)
    );

    const NovosibirskTime = moment.tz("Asia/Novosibirsk");
    const currentTimeCache = NovosibirskTime.format("HH:mm:ss");
    const currentDateCache = NovosibirskTime.format("D MMMM YYYY");
    const lastCacheEntry = { currentTimeCache, currentDateCache };

    if (isFavoriteGroup && isFavoriteScheduleGroup) {
      const newDataSchedule = { ...dataSchedule, lastCacheEntry };
      const groupIndex = scheduleStudent.groups.findIndex(
        (group) => Object.keys(group)[0] === idGroup.toString()
      );

      if (groupIndex !== -1) {
        scheduleStudent.groups[groupIndex][idGroup] = newDataSchedule;
        await AsyncStorage.setItem(
          STORAGE_KEY_SCHEDULE,
          JSON.stringify(scheduleStudent)
        );
      }
    } else if (!isFavoriteScheduleGroup && isFavoriteGroup) {
      setFavoriteSchedule(dataSchedule, idGroup, lastCacheEntry); // Добавление новой записи в расписание
    }
  } catch (error) {
    console.error("Ошибка при обновлении расписания", error);
  }
};
const Schedule = ({ navigation }: ScheduleProps) => {
  const theme = useSelector((state: ITheme) => state.SettingsSlice.theme);
  const isConnected = useSelector(
    (state: Settings) => state.SettingsSlice.isConnected
  );
  const dataSchedule = useSelector(
    (state: ScheduleState) => state.ScheduleInfoStudentSlice.dataSchedule
  );
  const groupType = useSelector(
    (state: ScheduleState) =>
      state.ScheduleInfoStudentSlice.dataSchedule.groupType
  );
  const selectIdGroup = useSelector(
    (state: ScheduleState) => state.ScheduleInfoStudentSlice.selectIdGroup
  );
  const isExtramuralScheduleUntilToday = useSelector(
    (state: ScheduleState) =>
      state.ScheduleInfoStudentSlice.isExtramuralScheduleUntilToday
  );
  const favoriteGroups = useSelector(
    (state: FavoriteGroupsState) => state.FavoriteGroupsSlice.favoriteGroups
  );
  const dataScheduleSession = useSelector(
    (state: ScheduleState) =>
      state.ScheduleInfoStudentSlice.dataSchedule.scheduleResident.session
  );
  const nameGroup = useSelector(
    (state: Namegroup) => state.GroupsInfoSlice.selectedGroupName
  );
  let hasWeekday: any = null;

  const dispatch = useDispatch();

  const [typeWeekToSwitch, setTypeWeekToSwitch] = useState("");
  const [currentTypeWeek, setCurrentTypeWeek] = useState<
    "numerator" | "denominator"
  >();
  const [currentDayForResident, setCurrentDayForResident] =
    useState<string>("");
  const [currentDayForExtramuralist, setCurrentDayForExtramuralist] =
    useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");

  const [timeArray, setTimeArray] = useState("");
  const [timeDifferences, setTimeDifference] = useState<string>("");
  const arrayStartsPairs: any[] = [];

  useEffect(() => {
    const currentDate = moment();
    const weekNumber = currentDate.isoWeek();
    const isNumeratorWeek =
      (weekNumber + dataSchedule.scheduleResident.weekCorrection) % 2 === 1;
    const typeToSwitch = isNumeratorWeek ? "numerator" : "denominator";
    setCurrentTypeWeek(typeToSwitch);
    setTypeWeekToSwitch(typeToSwitch);
  }, [dataSchedule]);

  useEffect(() => {
    const interval = setInterval(() => {
      const date = moment().tz("Asia/Novosibirsk").locale("ru");
      const day = weekdays[date.day() === 0 ? 6 : date.day() - 1];
      const time = date.format("HH:mm:ss");
      const dayExtramuralist = date.format("D MMMM YYYY");

      setCurrentDayForExtramuralist(dayExtramuralist);
      setCurrentDayForResident(day);
      setCurrentTime(time);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const currentTimeParts = currentTime.split(":").map(Number);
    const currentTimeInSeconds =
      currentTimeParts[0] * 3600 +
      currentTimeParts[1] * 60 +
      currentTimeParts[2];

    const nextSchedule = arrayStartsPairs.find((schedule) => {
      const scheduleParts = schedule.split("-");
      const startParts = scheduleParts[0].split(":").map(Number);
      const scheduleTimeInSeconds = startParts[0] * 3600 + startParts[1] * 60;
      return currentTimeInSeconds < scheduleTimeInSeconds;
    });

    if (nextSchedule) {
      const scheduleParts = nextSchedule.split("-");
      const startParts = scheduleParts[0].split(":").map(Number);
      const scheduleTimeInSeconds = startParts[0] * 3600 + startParts[1] * 60;

      const timeDiff = scheduleTimeInSeconds - currentTimeInSeconds;
      const formattedTimeDiff = formatTime(timeDiff);
      setTimeDifference(formattedTimeDiff);
      setTimeArray(scheduleParts[0]);
    }
  }, [currentTime, arrayStartsPairs]);

  useEffect(() => {
    if (isConnected) {
      updateFavoriteGroup(
        selectIdGroup,
        favoriteGroups,
        dataSchedule,
        dispatch
      );
    }
  }, [selectIdGroup, dataSchedule, isConnected, favoriteGroups]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isConnected) {
        const storedSchedule = await AsyncStorage.getItem(STORAGE_KEY_SCHEDULE);

        if (storedSchedule) {
          const scheduleStudent = JSON.parse(storedSchedule);

          if (scheduleStudent && scheduleStudent.groups) {
            const foundGroup = scheduleStudent.groups.find(
              (item) => Object.keys(item)[0] === selectIdGroup.toString()
            );

            if (foundGroup) {
              const lastCacheEntry =
                foundGroup[selectIdGroup.toString()].lastCacheEntry;
              dispatch(setLastCacheEntryStudent(lastCacheEntry));
            }
          }
        }
      }
    };

    fetchData();
  }, [isConnected, selectIdGroup]);

  const fetchScheduleEducator = async (fullNameEducator, idEducator) => {
    try {
      dispatch(setNameEducator(fullNameEducator));
      await getScheduleEducator(dispatch, idEducator);
      navigation.navigate("ScheduleEducator");
    } catch (error) {
      console.log(error);
    }
  };

  const currentWeekSchedule =
    typeWeekToSwitch === "numerator"
      ? dataSchedule.scheduleResident.numerator
      : dataSchedule.scheduleResident.denominator;

  const initialFilteredSchedule = weekdays.map((weekday) =>
    currentWeekSchedule.filter(
      (item) => item.weekday === weekday || item.date === weekday
    )
  );

  initialFilteredSchedule.forEach((schedule) => {
    schedule.forEach((scheduleItem) => {
      const [start] = scheduleItem.numberPair.split("-");
      if (scheduleItem.weekday === currentDayForResident) {
        arrayStartsPairs.push(start);
      }
    });
  });
  hasWeekday =
    typeWeekToSwitch === "numerator"
      ? dataSchedule.scheduleResident.numerator.some(
          (item: IScheduleInfo) =>
            (item.hasOwnProperty("weekday") && item.weekday !== "") ||
            (item.hasOwnProperty("date") && item.date !== "")
        )
      : dataSchedule.scheduleResident.denominator.some(
          (item: IScheduleInfo) =>
            (item.hasOwnProperty("weekday") && item.weekday !== "") ||
            (item.hasOwnProperty("date") && item.date !== "")
        );
  return (
    <ThemeProvider theme={theme}>
      <Container>
        {groupType === "resident" && (
          <TypeWeekContainer>
            <View style={{ flexDirection: "column", flex: 1 }}>
              <Text
                style={{
                  color: theme.textColor,
                  fontSize: screenWidth * 0.04263,
                  textAlign: "center",
                  fontFamily: "Montserrat-SemiBold",
                }}
              >
                {currentTypeWeek === "numerator" &&
                  ` ${"Текущая №" + dataSchedule.currentWeekNumber}`}
              </Text>
              <TypeWeekButton
                onPress={() => {
                  setTypeWeekToSwitch("numerator");
                }}
                activeOpacity={0.9}
              >
                <TypeWeekText
                  typeWeek={
                    theme === lightTheme
                      ? typeWeekToSwitch === "numerator"
                        ? "#FFFFFF"
                        : "#FFFFFFB2"
                      : typeWeekToSwitch === "numerator"
                      ? "#004C6F"
                      : "#004C6FB2"
                  }
                >
                  Числитель
                </TypeWeekText>
              </TypeWeekButton>
            </View>
            <View style={{ flexDirection: "column", flex: 1 }}>
              <Text
                style={{
                  color: theme.textColor,
                  fontSize: screenWidth * 0.04263,
                  textAlign: "center",
                  fontFamily: "Montserrat-SemiBold",
                }}
              >
                {currentTypeWeek === "denominator" &&
                  ` ${"Текущая №" + dataSchedule.currentWeekNumber}`}
              </Text>
              <TypeWeekButton
                onPress={() => {
                  setTypeWeekToSwitch("denominator");
                }}
                activeOpacity={0.9}
              >
                <TypeWeekText
                  typeWeek={
                    theme === lightTheme
                      ? typeWeekToSwitch === "denominator"
                        ? "#FFFFFF"
                        : "#FFFFFFB2"
                      : typeWeekToSwitch === "denominator"
                      ? "#004C6F"
                      : "#004C6FB2"
                  }
                >
                  Знаменатель
                </TypeWeekText>
              </TypeWeekButton>
            </View>
            <View style={{ flexDirection: "column", flex: 1 }}>
              <Text
                style={{
                  color: theme.textColor,
                  fontSize: screenWidth * 0.043,
                  textAlign: "center",
                  fontFamily: "Montserrat-SemiBold",
                }}
              ></Text>
              <TypeWeekButton
                onPress={() => setTypeWeekToSwitch("session")}
                activeOpacity={0.9}
              >
                <TypeWeekText
                  typeWeek={
                    theme === lightTheme
                      ? typeWeekToSwitch === "session"
                        ? "#FFFFFF"
                        : "#FFFFFFB2"
                      : typeWeekToSwitch === "session"
                      ? "#004C6F"
                      : "#004C6FB2"
                  }
                >
                  Сессия
                </TypeWeekText>
              </TypeWeekButton>
            </View>
          </TypeWeekContainer>
        )}

        {!isConnected && (
          <View>
            <NoConnected>Отсутствует соединение.</NoConnected>
            <NoConnected>
              {dataSchedule.lastCacheEntry &&
                "Расписание актуально на " +
                  dataSchedule.lastCacheEntry.currentDateCache +
                  " " +
                  dataSchedule.lastCacheEntry.currentTimeCache}
            </NoConnected>
          </View>
        )}
        {groupType === "resident" && typeWeekToSwitch !== "session" && (
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
                      isColorPair={
                        theme === lightTheme ? "#d9d9d999" : "#46464699"
                      }
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
              }
              timeFilteredSchedule.forEach((pair: any) => {
                // Замените any на тип вашего объекта
                if (pair.weeks) {
                  const weekRanges = pair.weeks.trim().split(/(?=\()/);

                  weekRanges.forEach((week: string) => {
                    // Проверка на диапазон недель
                    const rangeNumbers = week.match(/\d+-\d+/);
                    if (rangeNumbers) {
                      const [start, end] = rangeNumbers[0]
                        .split("-")
                        .map(Number);
                      if (
                        +dataSchedule.currentWeekNumber >= start &&
                        +dataSchedule.currentWeekNumber <= end
                      ) {
                        matchingIdPairs.push(pair.idPair);
                      }
                    } else {
                      // Проверка на одиночное число
                      const singleWeekNumber = week.match(/\d+/);
                      if (
                        singleWeekNumber &&
                        parseInt(singleWeekNumber[0], 10) ===
                          +dataSchedule.currentWeekNumber
                      ) {
                        matchingIdPairs.push(pair.idPair);
                      }
                    }
                  });
                }
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
                    keyExtractor={(item, index) => item.idPair.toString()}
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
                        moment(currentTime, "HH:mm").isSameOrAfter(startTime) &&
                        moment(currentTime, "HH:mm").isSameOrBefore(endTime);

                      const isColorPair = isCurrent;
                      const timeDifference = moment.utc(
                        moment(endTime, "HH:mm:ss").diff(
                          moment(currentTime, "HH:mm:ss")
                        )
                      );
                      const formattedTimeDifference = timeDifference
                        .format("HH:mm:ss")
                        .padStart(8, "0");
                      const textColorInner =
                        !item.weeks ||
                        item.weeks.trim() === "" ||
                        matchingIdPairs.includes(item.idPair as any)
                          ? theme.textColor
                          : theme === lightTheme
                          ? "#a0a0a0" // Светло-серый цвет для текста
                          : "#606060"; // Темно-серый цвет для текста

                      return (
                        <View
                          key={item.idPair}
                          style={{ alignItems: "center" }}
                        >
                          <ContainerPair
                            isColorPair={
                              // Проверяем совпадение по idPair или если weeks пустой
                              !item.weeks ||
                              item.weeks.trim() === "" ||
                              matchingIdPairs.includes(item.idPair as any)
                                ? theme === lightTheme
                                  ? isColorPair
                                    ? "#C3C9DE"
                                    : "#d9d9d999"
                                  : isColorPair
                                  ? "#4B61B0"
                                  : "#46464699"
                                : "transparent" // Если пары нет в массиве, ставим прозрачный фон
                            }
                          >
                            <TextNamePair
                              ellipsizeMode="tail"
                              style={{ color: textColorInner }} // Применяем цвет текста
                            >
                              {item.namePair}
                            </TextNamePair>
                            <View style={{ flexDirection: "row" }}>
                              <ContainerLeft>
                                <TouchableOpacity
                                  onPress={() => {
                                    if (!isConnected) {
                                      ToastAndroid.show(
                                        "Нет соединения с интернетом",
                                        ToastAndroid.SHORT
                                      );
                                    } else {
                                      dispatch(
                                        setSelectIdEducator(item.idEducator)
                                      );
                                      fetchScheduleEducator(
                                        item.fullNameEducator,
                                        item.idEducator
                                      );
                                    }
                                  }}
                                >
                                  <TextNameEducator
                                    style={{ color: textColorInner }} // Применяем цвет текста
                                  >
                                    {item.nameEducator &&
                                      item.nameEducator +
                                        " " +
                                        item.regaliaEducator}
                                  </TextNameEducator>
                                </TouchableOpacity>
                                <TextRoomNumber
                                  style={{ color: textColorInner }} // Применяем цвет текста
                                >
                                  {item.roomNumber &&
                                    "Кабинет №" + item.roomNumber}
                                </TextRoomNumber>
                              </ContainerLeft>
                              <ContainerRight>
                                <TextNumberPair
                                  style={{ color: textColorInner }} // Применяем цвет текста
                                >
                                  {item.numberPair && item.numberPair}
                                </TextNumberPair>
                                {!item.weeks && item.typePair && (
                                  <TextTypePair
                                    style={{ color: textColorInner }} // Применяем цвет текста
                                  >
                                    {"Тип пары: " + item.typePair}
                                  </TextTypePair>
                                )}
                                {isCurrent &&
                                matchingIdPairs.includes(item.idPair as any) ? (
                                  <TimeToLesson>
                                    До окончания пары: {formattedTimeDifference}
                                  </TimeToLesson>
                                ) : (
                                  matchingIdPairs.includes(
                                    item.idPair as any
                                  ) && // Проверяем, что недели совпадают
                                  item.weekday === currentDayForResident &&
                                  timeArray === start && (
                                    <TimeToLesson>
                                      До начала пары: {timeDifferences}
                                    </TimeToLesson>
                                  )
                                )}
                              </ContainerRight>
                            </View>

                            {item.comments && (
                              <CommentsText
                                style={{
                                  textAlign: "center",
                                  color: textColorInner,
                                }}
                              >
                                {/^(https?:\/\/|www\.|https?:\/\/www\.)[\w\-.]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(
                                  item.comments
                                ) ? (
                                  <Text
                                    style={{ textDecorationLine: "underline" }}
                                    onPress={() =>
                                      Linking.openURL(item.comments)
                                    }
                                  >
                                    Ссылка
                                  </Text>
                                ) : (
                                  item.comments
                                )}
                              </CommentsText>
                            )}
                            {item.weeks &&
                              item.weeks.trim() !== "" &&
                              item.weeks
                                .split(/(?=\()/) // Разделяем строку на части, начиная с символа '('
                                .filter((part) => part.trim() !== "") // Фильтруем пустые строки
                                .map((week, idx) => {
                                  const currentWeekNumber =
                                    +dataSchedule.currentWeekNumber;

                                  // Извлекаем числа из строки формата "(10-12)" или одну неделю
                                  const weekRange = week.match(/\d+-\d+/);
                                  const isWithinRange = weekRange
                                    ? weekRange[0]
                                        .split("-")
                                        .map(Number)
                                        .some(
                                          (num) => num === currentWeekNumber
                                        )
                                    : week.match(/\d+/)
                                    ? parseInt(week.match(/\d+/)[0], 10) ===
                                      currentWeekNumber
                                    : false;

                                  // Устанавливаем цвет текста
                                  const textColorWeek = isWithinRange
                                    ? theme.textColor
                                    : theme === lightTheme
                                    ? "#a0a0a0" // Светло-серый цвет для текста
                                    : "#606060"; // Темно-серый цвет для текста

                                  return (
                                    <View key={idx} style={{ marginBottom: 5 }}>
                                      <CommentsText
                                        style={{
                                          color: textColorWeek,
                                        }}
                                      >
                                        {week.trim() + " нед"}
                                      </CommentsText>
                                    </View>
                                  );
                                })}
                          </ContainerPair>
                        </View>
                      );
                    }}
                  />
                </View>
              );
            }}
          />
        )}
        {groupType !== "resident" &&
        groupType !== "session" &&
        dataSchedule.extramuralIsActive ? (
          <View>
            {isExtramuralScheduleUntilToday ? (
              <View
                style={{
                  paddingHorizontal: screenWidth * 0.04,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat-Bold",
                    color: theme.textColor,
                    marginTop: screenHeight * 0.01,
                    fontSize: screenWidth * 0.04,
                  }}
                >
                  Что бы скрыть прошедшие пары нажмите
                </Text>
                <BtnGetScheduleExtramural
                  onPress={async () => {
                    if (!isConnected) {
                      {
                        ToastAndroid.show(
                          "Нет соединения с интернетом",
                          ToastAndroid.SHORT
                        );
                      }
                    } else {
                      await getSchedule(
                        selectIdGroup,
                        dispatch,
                        nameGroup,
                        false
                      );
                      dispatch(
                        setIsExtramuralScheduleUntilTodayStudent(
                          !isExtramuralScheduleUntilToday
                        )
                      );
                    }
                  }}
                >
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
            ) : (
              <View
                style={{
                  paddingHorizontal: screenWidth * 0.05,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat-Bold",
                    color: theme.textColor,
                    marginTop: screenHeight * 0.01,
                    fontSize: screenWidth * 0.04,
                  }}
                >
                  Скрыты уже прошедшие занятия. Чтобы увидеть расписание ранее
                  сегодняшней даты нажмите
                </Text>
                <BtnGetScheduleExtramural
                  onPress={async () => {
                    if (!isConnected) {
                      {
                        ToastAndroid.show(
                          "Нет соединения с интернетом",
                          ToastAndroid.SHORT
                        );
                      }
                    } else {
                      await getFullScheduleStudentExtramuralist(
                        dispatch,
                        selectIdGroup
                      );
                      dispatch(
                        setIsExtramuralScheduleUntilTodayStudent(
                          !isExtramuralScheduleUntilToday
                        )
                      );
                    }
                  }}
                >
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
            )}
            <FlatList
              data={dataSchedule.scheduleExtramural}
              keyExtractor={(item, index) => index.toString()}
              initialNumToRender={3}
              maxToRenderPerBatch={10}
              windowSize={10}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: isConnected
                  ? screenHeight * 0
                  : screenHeight * 0.09,
              }}
              renderItem={({ item, index }) => (
                <View
                  key={index}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <DateText>{item.date && item.date}</DateText>

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
                        moment(currentTime, "HH:mm").isBetween(
                          startTime,
                          endTime
                        );
                      const isColorPair = isCurrent;

                      return (
                        <ContainerPair
                          key={item.idPair}
                          isColorPair={
                            theme === lightTheme
                              ? isColorPair
                                ? "#C3C9DE"
                                : "#d9d9d999"
                              : isColorPair
                              ? "#4B61B0"
                              : "#46464699"
                          }
                        >
                          <TextNamePair>{item.namePair}</TextNamePair>
                          <View style={{ flexDirection: "row" }}>
                            <ContainerLeft>
                              <TextNameGroup>
                                <TouchableOpacity
                                  onPress={() => {
                                    if (!isConnected) {
                                      {
                                        ToastAndroid.show(
                                          "Нет соединения с интернетом",
                                          ToastAndroid.SHORT
                                        );
                                      }
                                    } else {
                                      fetchScheduleEducator(
                                        item.fullNameEducator,
                                        item.idEducator
                                      );
                                    }
                                  }}
                                >
                                  <TextNameEducator>
                                    {item.nameEducator && item.nameEducator}
                                  </TextNameEducator>
                                </TouchableOpacity>
                              </TextNameGroup>
                              <TextRoomNumber>
                                {item.roomNumber &&
                                  "Кабинет № " + item.roomNumber}
                              </TextRoomNumber>
                            </ContainerLeft>
                            <ContainerRight>
                              <TextNumberPair>
                                {item.numberPair && item.numberPair}
                              </TextNumberPair>
                              <TextTypePair>
                                {item.typePair && "Тип пары " + item.typePair}
                              </TextTypePair>
                            </ContainerRight>
                          </View>
                          {item.comments && (
                            <CommentsText
                              style={{
                                textAlign: "center",
                              }}
                            >
                              {/^(https?:\/\/|www\.|https?:\/\/www\.)[\w\-.]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(
                                item.comments
                              ) ? (
                                <Text
                                  style={{ textDecorationLine: "underline" }}
                                  onPress={() => Linking.openURL(item.comments)}
                                >
                                  Ссылка
                                </Text>
                              ) : (
                                item.comments
                              )}
                            </CommentsText>
                          )}
                        </ContainerPair>
                      );
                    }}
                  />
                </View>
              )}
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
          <FlatList
            data={dataScheduleSession}
            keyExtractor={(item, index) => index.toString()}
            initialNumToRender={4}
            maxToRenderPerBatch={10}
            windowSize={10}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View
                key={index}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <DateText>{item.date && item.date}</DateText>

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
                      moment(currentTime, "HH:mm").isBetween(
                        startTime,
                        endTime
                      );
                    const isColorPair = isCurrent;

                    return (
                      <ContainerPair
                        key={item.idPair}
                        isColorPair={
                          theme === lightTheme
                            ? isColorPair
                              ? "#C3C9DE"
                              : "#d9d9d999"
                            : isColorPair
                            ? "#4B61B0"
                            : "#46464699"
                        }
                      >
                        <TextNamePair>{item.namePair}</TextNamePair>
                        <View style={{ flexDirection: "row" }}>
                          <ContainerLeft>
                            <TextNameGroup>
                              <TouchableOpacity
                                onPress={() => {
                                  if (!isConnected) {
                                    {
                                      ToastAndroid.show(
                                        "Нет соединения с интернетом",
                                        ToastAndroid.SHORT
                                      );
                                    }
                                  } else {
                                    fetchScheduleEducator(
                                      item.fullNameEducator,
                                      item.idEducator
                                    );
                                  }
                                }}
                              >
                                <TextNameEducator>
                                  {item.nameEducator &&
                                    item.nameEducator +
                                      " " +
                                      item.regaliaEducator}
                                </TextNameEducator>
                              </TouchableOpacity>
                            </TextNameGroup>
                            <TextRoomNumber>
                              {item.roomNumber &&
                                "Кабинет № " + item.roomNumber}
                            </TextRoomNumber>
                            <TextRoomNumber>
                              {item.roomName && item.roomName}
                            </TextRoomNumber>
                          </ContainerLeft>
                          <ContainerRight>
                            <TextNumberPair>
                              {item.numberPair && item.numberPair}
                            </TextNumberPair>
                            <TextTypePair>
                              {item.typePairRetake
                                ? "Тип пары " + item.typePairRetake
                                : "Тип пары " + item.typePair}
                            </TextTypePair>
                          </ContainerRight>
                        </View>
                        {item.comments && (
                          <CommentsText
                            style={{
                              textAlign: "center",
                            }}
                          >
                            {/^(https?:\/\/|www\.|https?:\/\/www\.)[\w\-.]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(
                              item.comments
                            ) ? (
                              <Text
                                style={{ textDecorationLine: "underline" }}
                                onPress={() => Linking.openURL(item.comments)}
                              >
                                Ссылка
                              </Text>
                            ) : (
                              item.comments
                            )}
                          </CommentsText>
                        )}
                      </ContainerPair>
                    );
                  }}
                />
              </View>
            )}
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
