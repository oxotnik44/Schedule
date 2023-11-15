import moment from "moment";
import "moment/locale/ru";
import "moment-timezone";
import { useCallback, useEffect, useState } from "react";
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
  CommentsText,
  Container,
  ContainerLeft,
  ContainerPair,
  ContainerRight,
  DateText,
  NoConnected,
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
import { setNameEducator } from "../../redux/reducers/educatorReducer";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../Navigate";
import {
  getFullScheduleStudentExtramuralist,
  getSchedule,
  getScheduleEducator,
} from "../../api/apiSchedule";
import { lightTheme } from "../../redux/reducers/settingsReducer";
import { ThemeProvider } from "styled-components/native";
import { setSelectIdEducator } from "../../redux/reducers/scheduleEducatorInfo";
import {
  setIsExtramuralScheduleUntilTodayStudent,
  setLastCacheEntryStudent,
} from "../../redux/reducers/scheduleStudentInfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setFavoriteSchedule } from "../../redux/reducers/favoritesReducer/favoriteScheduleStudent";
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
}
interface ScheduleState {
  scheduleInfoStudentReducer: {
    dataSchedule: {
      lastCacheEntry: {
        currentDateCache: string;
        currentTimeCache: string;
      };
      groupType: string;
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
    };
    selectIdEducator: number;
    selectIdGroup: number;
    isExtramuralScheduleUntilToday: boolean;
  };
}
interface FavoriteGroupsState {
  favoriteGroupReducer: {
    favoriteGroups: { idGroup: number; nameGroup: string }[];
  };
}
// Тип ScheduleProps
type ScheduleProps = {
  navigation: StackNavigationProp<RootStackParamList, "Schedule">;
};
type ITheme = {
  settingsReducer: {
    theme: any;
  };
};
interface Settings {
  settingsReducer: {
    isConnected: boolean;
  };
}
interface Namegroup {
  groupsInfoReducer: {
    selectedGroupName: string;
  };
}
const Schedule = ({ navigation }: ScheduleProps) => {
  const theme = useSelector((state: ITheme) => state.settingsReducer.theme);
  moment.tz.setDefault("Asia/Novosibirsk");
  const dispatch = useDispatch();
  //есть ли подключение к инету
  const isConnected = useSelector(
    (state: Settings) => state.settingsReducer.isConnected
  );
  const dataSchedule = useSelector(
    (state: ScheduleState) => state.scheduleInfoStudentReducer.dataSchedule
  );
  const groupType = useSelector(
    (state: ScheduleState) =>
      state.scheduleInfoStudentReducer.dataSchedule.groupType
  );
  const selectIdGroup = useSelector(
    (state: ScheduleState) => state.scheduleInfoStudentReducer.selectIdGroup
  );
  //для заочников расписание с текущей даты или до текущей
  const isExtramuralScheduleUntilToday = useSelector(
    (state: ScheduleState) =>
      state.scheduleInfoStudentReducer.isExtramuralScheduleUntilToday
  );
  const favoriteGroups = useSelector(
    (state: FavoriteGroupsState) => state.favoriteGroupReducer.favoriteGroups
  );
  const dataScheduleSession = useSelector(
    (state: ScheduleState) =>
      state.scheduleInfoStudentReducer.dataSchedule.scheduleResident.session
  );
  const nameGroup = useSelector(
    (state: Namegroup) => state.groupsInfoReducer.selectedGroupName
  );
  const [typeWeekToSwitch, setTypeWeekToSwitch] = useState("");
  //не изменяемая для показа текущей недели
  const [currentTypeWeek, setCurrentTypeWeek] = useState<
    "numerator" | "denominator"
  >();

  //проверка дня для времени до и после пары
  const [currentDayForResident, setСurrentDayForResident] =
    useState<string>("Понедельник");
  //проверка дня для текущей пары
  const [currentDayForExtramuralist, setCurrentDayForExtramuralist] =
    useState<string>("");
  //просто текущее время
  const [currentTime, setCurrentTime] = useState<string>("");
  //массив с началом пар для времени до и после пары
  const arrayStartsPairs: any[] = [];
  const [timeArray, setTimeArray] = useState("");
  const [timeDifferences, setTimeDifference] = useState<string>("");
  const weekdays = [
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ];
  useEffect(() => {
    setTypeWeekToSwitch(() => {
      const currentDate = moment();
      const weekNumber = currentDate.isoWeek();
      const isNumeratorWeek =
        (weekNumber + dataSchedule.scheduleResident.weekCorrection) % 2 === 1; // Если номер недели нечетный, то это "numerator"
      setCurrentTypeWeek(isNumeratorWeek ? "numerator" : "denominator");
      return isNumeratorWeek ? "numerator" : "denominator";
    });
  }, [dataSchedule]);

  useEffect(() => {
    const updateCurrentTime = () => {
      const date = moment().tz("Asia/Novosibirsk").locale("ru");
      const day = weekdays[date.day() === 0 ? 6 : date.day() - 1];
      const time = date.format("HH:mm:ss");
      const dayExtramuralist = date.format("D MMMM YYYY");
      setCurrentDayForExtramuralist(dayExtramuralist);
      setСurrentDayForResident(day);
      setCurrentTime(time);
    };
    const interval = setInterval(updateCurrentTime, 1000);
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

    for (let i = 0; i < arrayStartsPairs.length; i++) {
      const scheduleParts = arrayStartsPairs[i].split("-");
      const startParts = scheduleParts[0].split(":").map(Number);
      const scheduleTimeInSeconds = startParts[0] * 3600 + startParts[1] * 60;

      if (currentTimeInSeconds < scheduleTimeInSeconds) {
        const timeDiff = scheduleTimeInSeconds - currentTimeInSeconds;
        const formattedTimeDiff = formatTime(timeDiff);
        setTimeDifference(formattedTimeDiff);
        setTimeArray(scheduleParts[0]);

        break;
      }
    }
  }, [currentTime, arrayStartsPairs]);
  let updateFavoriteGroup;
  const STORAGE_KEY_SCHEDULE = "favoriteSchedule";
  useEffect(() => {
    if (isConnected) {
      updateFavoriteGroup = async (idGroup: number) => {
        try {
          const storedSchedule = await AsyncStorage.getItem(
            STORAGE_KEY_SCHEDULE
          );
          let scheduleStudent = storedSchedule
            ? JSON.parse(storedSchedule)
            : { groups: [], educators: [] };
          const isFavoriteGroup = favoriteGroups.some(
            (groupFavorite) => groupFavorite.idGroup === idGroup
          );

          const isFavoriteScheduleGroup = scheduleStudent.groups.some(
            (group: any) => group.hasOwnProperty(idGroup)
          );
          const NovosibirskTime = moment.tz("Asia/Novosibirsk");

          const currentTimeCache = NovosibirskTime.format("HH:mm:ss");
          const currentDateCache = NovosibirskTime.format("D MMMM YYYY");
          const lastCacheEntry = {
            currentTimeCache,
            currentDateCache,
          };
          if (isFavoriteGroup && isFavoriteScheduleGroup) {
            const newDataSchedule = {
              ...dataSchedule,
              lastCacheEntry,
            };
            const groupIndex = scheduleStudent.groups.findIndex(
              (group: any) => Object.keys(group)[0] === idGroup.toString()
            );

            if (groupIndex !== -1) {
              console.log("Обновление");
              scheduleStudent.groups[groupIndex][idGroup] = newDataSchedule;
              console.log(scheduleStudent);
              await AsyncStorage.setItem(
                STORAGE_KEY_SCHEDULE,
                JSON.stringify(scheduleStudent)
              );
            }
          } else if (!isFavoriteScheduleGroup && isFavoriteGroup) {
            console.log("Создание");

            setFavoriteSchedule(dataSchedule, idGroup, lastCacheEntry); // Добавление новой записи
          }
        } catch (error) {
          console.error("Ошибка при обновлении расписания", error);
        }
      };

      updateFavoriteGroup(selectIdGroup);
    }
  }, [selectIdGroup, dataSchedule]);
  useEffect(() => {
    const fetchData = async () => {
      if (!isConnected) {
        const storedSchedule = await AsyncStorage.getItem("favoriteSchedule");
        if (storedSchedule) {
          const scheduleStudent = JSON.parse(storedSchedule);
          if (scheduleStudent && scheduleStudent.groups) {
            const foundGroup = scheduleStudent.groups.find(
              (item: any) => Object.keys(item)[0] === selectIdGroup.toString()
            );
            if (foundGroup) {
              const lastCacheEntry =
                foundGroup[selectIdGroup.toString()].lastCacheEntry;
              dispatch(setLastCacheEntryStudent(lastCacheEntry));
              // Здесь вы можете использовать lastCacheEntry по вашему усмотрению
            }
          }
        }
      }
    };

    fetchData();
  }, [isConnected, selectIdGroup]);
  // Добавлен isFavoriteGroup в зависимости
  const fetchScheduleEducator = async (
    fullNameEducator: string,
    idEducator: number
  ) => {
    try {
      dispatch(setNameEducator(fullNameEducator));
      await getScheduleEducator(dispatch, idEducator);
      navigation.navigate("ScheduleEducator");
    } catch (error) {
      console.log(error);
    }
  };
  let currentWeekSchedule =
    typeWeekToSwitch === "numerator"
      ? dataSchedule.scheduleResident.numerator
      : dataSchedule.scheduleResident.denominator;
  const initialFilteredSchedule = weekdays.map((weekday) =>
    currentWeekSchedule.filter(
      (item) => item.weekday === weekday || item.date === weekday
    )
  );
  weekdays.forEach((weekday, index) => {
    const timeFilteredSchedule = initialFilteredSchedule[index];
    timeFilteredSchedule.forEach((scheduleItem) => {
      const [start] = scheduleItem.numberPair.split("-");
      if (scheduleItem.weekday === currentDayForResident) {
        arrayStartsPairs.push(start);
      }
    });
  });

  const formatTime = (timeDiff: number) => {
    const hours = Math.floor(timeDiff / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((timeDiff % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timeDiff % 60).toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };
  return (
    <ThemeProvider theme={theme}>
      <Container>
        {groupType === "resident" && (
          <TypeWeekContainer>
            <View style={{ flexDirection: "column", flex: 1 }}>
              <Text
                style={{
                  color: theme.textColor,
                  fontSize: screenWidth * 0.05,
                  textAlign: "center",
                  fontFamily: "Montserrat-SemiBold",
                }}
              >
                {currentTypeWeek === "numerator" && "Текущая"}
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
                  fontSize: screenWidth * 0.05,
                  textAlign: "center",
                  fontFamily: "Montserrat-SemiBold",
                }}
              >
                {currentTypeWeek === "denominator" && "Текущая"}
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
                  fontSize: screenWidth * 0.05,
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
                  " в " +
                  dataSchedule.lastCacheEntry.currentTimeCache}
            </NoConnected>
          </View>
        )}
        <View>
          {groupType === "resident" && typeWeekToSwitch !== "session" && (
            <FlatList
              data={weekdays}
              keyExtractor={(item, index) => index.toString()}
              initialNumToRender={2}
              maxToRenderPerBatch={5}
              windowSize={10}
              contentContainerStyle={{
                paddingBottom: isConnected
                  ? screenHeight * 0.09
                  : screenHeight * 0.19,
              }}
              renderItem={({ item, index }) => {
                const timeFilteredSchedule = initialFilteredSchedule[index];

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
                        <TextSelfStudy>
                          День самостоятельной работы
                        </TextSelfStudy>
                      </ContainerPair>
                    </View>
                  );
                }

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
                      renderItem={({ item }) => {
                        const [start, end] = item.numberPair.split("-");
                        const startTime = moment(start, "HH:mm");
                        const endTime = moment(end, "HH:mm");
                        const isCurrent =
                          currentDayForResident ===
                            (item.weekday || item.date) &&
                          moment(currentTime, "HH:mm:ss").isSameOrAfter(
                            startTime
                          ) &&
                          moment(currentTime, "HH:mm:ss").isSameOrBefore(
                            endTime
                          );

                        const isColorPair = isCurrent;
                        const timeDifference = moment.utc(
                          moment(endTime, "HH:mm:ss").diff(
                            moment(currentTime, "HH:mm:ss")
                          )
                        );
                        const formattedTimeDifference = timeDifference
                          .format("HH:mm:ss")
                          .padStart(8, "0");

                        return (
                          <View
                            key={item.idPair}
                            style={{ alignItems: "center" }}
                          >
                            <ContainerPair
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
                              <TextNamePair ellipsizeMode="tail">
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
                                    <TextNameEducator>
                                      {item.nameEducator &&
                                        item.nameEducator +
                                          " " +
                                          item.regaliaEducator}
                                    </TextNameEducator>
                                  </TouchableOpacity>
                                  <TextRoomNumber>
                                    {item.roomNumber &&
                                      "Кабинет №" + item.roomNumber}
                                  </TextRoomNumber>
                                </ContainerLeft>
                                <ContainerRight>
                                  <TextNumberPair>
                                    {item.numberPair && item.numberPair}
                                  </TextNumberPair>
                                  <TextTypePair>
                                    {item.typePair &&
                                      "Тип пары: " + item.typePair}
                                  </TextTypePair>
                                  {item.weekday === currentDayForResident &&
                                    timeArray === start && (
                                      <TimeToLesson>
                                        До начала пары: {timeDifferences}
                                      </TimeToLesson>
                                    )}

                                  {isCurrent && (
                                    <TimeToLesson>
                                      До окончания пары:{" "}
                                      {formattedTimeDifference}
                                    </TimeToLesson>
                                  )}
                                </ContainerRight>
                              </View>

                              {item.comments && (
                                <CommentsText style={{ textAlign: "center" }}>
                                  {/^(https?:\/\/|www\.|https?:\/\/www\.)[\w\-.]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(
                                    item.comments
                                  ) ? (
                                    <Text
                                      onPress={() =>
                                        Linking.openURL(item.comments)
                                      }
                                    >
                                      {item.comments}
                                    </Text>
                                  ) : (
                                    item.comments
                                  )}
                                </CommentsText>
                              )}
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
          {groupType === "extramural" && (
            <View>
              {isExtramuralScheduleUntilToday ? (
                <View style={{ paddingHorizontal: screenWidth * 0.04 }}>
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
                        await getSchedule(selectIdGroup, dispatch, nameGroup);
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
                <View style={{ paddingHorizontal: screenWidth * 0.05 }}>
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
                              <CommentsText style={{ textAlign: "center" }}>
                                {/^(https?:\/\/|www\.|https?:\/\/www\.)[\w\-.]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(
                                  item.comments
                                ) ? (
                                  <Text
                                    onPress={() =>
                                      Linking.openURL(item.comments)
                                    }
                                  >
                                    {item.comments}
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
          )}
          {typeWeekToSwitch === "session" && (
            <FlatList
              data={dataScheduleSession}
              keyExtractor={(item, index) => index.toString()}
              initialNumToRender={3}
              maxToRenderPerBatch={10}
              windowSize={10}
              contentContainerStyle={{
                paddingBottom: isConnected
                  ? screenHeight * 0.09
                  : screenHeight * 0.19,
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
                            <CommentsText style={{ textAlign: "center" }}>
                              {/^(https?:\/\/|www\.|https?:\/\/www\.)[\w\-.]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(
                                item.comments
                              ) ? (
                                <Text
                                  onPress={() => Linking.openURL(item.comments)}
                                >
                                  {item.comments}
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
          )}
        </View>
      </Container>
    </ThemeProvider>
  );
};

export default Schedule;
