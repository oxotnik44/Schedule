import moment from "moment";
import "moment/locale/ru";
import "moment-timezone";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
  FlatList,
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
  TextNameGroup,
  TextNamePair,
  TextNumberPair,
  TextRoomNumber,
  TextSelfStudy,
  TextTypePair,
  TextWeekday,
  TimeToLesson,
  ToggleButton,
  ToggleButtonText,
  ToggleContainer,
  TypeWeekButton,
  TypeWeekContainer,
  TypeWeekText,
} from "./ScheduleStyle";
import { setNameGroup } from "../../redux/slices/GroupsInfoSlice";
import {
  getFullScheduleEducatorExtramural,
  getSchedule,
  getScheduleEducator,
} from "../../api/apiSchedule";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../Navigate";
import { lightTheme } from "../../redux/slices/SettingsSlice";
import {
  setIsFullScheduleEducator,
  setLastCacheEntryEducator,
} from "../../redux/slices/ScheduleEducatorInfoSlice";
import { setSelectIdGroup } from "../../redux/slices/ScheduleStudentInfoSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setFavoriteSchedule } from "../../redux/slices/FavoritesSlice/FavoriteScheduleEducator";

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
    };
    selectIdEducator: number;
    isFullSchedule: boolean;
  };
}
interface IScheduleItem {
  idPair: number;
  date: string | null;
  weekday: string;
  // Дополнительные поля, которые у вас есть в объекте
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
  const weekdays = [
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ];
  const favoriteEducators = useSelector(
    (state: FavoriteEducatorsState) =>
      state.FavoriteEducatorsSlice.favoriteEducators
  );
  const fetchSchedule = async (idGroup: number, groupName: string) => {
    try {
      dispatch(setNameGroup(groupName));
      await getSchedule(idGroup, dispatch, groupName, false);
      navigation.navigate("Schedule");
    } catch (error) {
      console.log(error);
    }
  };
  const formatTime = (timeDiff: number) => {
    const hours = String(Math.floor(timeDiff / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((timeDiff % 3600) / 60)).padStart(2, "0");
    const seconds = String(timeDiff % 60).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };
  const getFilteredSchedule = () => {
    const filteredSchedule =
      typeWeekToSwitch === "numerator"
        ? dataScheduleEducator.scheduleResident.numerator
        : dataScheduleEducator.scheduleResident.denominator;

    return weekdays.map((weekday) =>
      filteredSchedule.filter(
        (item) => item.weekday === weekday || item.date === weekday
      )
    );
  };
  const filteredSchedules = getFilteredSchedule();

  filteredSchedules.forEach((timeFilteredSchedule, index) => {
    timeFilteredSchedule.forEach((scheduleItem) => {
      const [start] = scheduleItem.numberPair.split("-");

      if (scheduleItem.weekday === currentDayForResident) {
        resultArray.push(start);
      }
    });
  });

  hasWeekday =
    typeWeekToSwitch === "numerator"
      ? dataScheduleEducator.scheduleResident.numerator.some(
          (item: IScheduleInfo) =>
            (item.hasOwnProperty("weekday") && item.weekday !== "") ||
            (item.hasOwnProperty("date") && item.date !== "")
        )
      : dataScheduleEducator.scheduleResident.denominator.some(
          (item: IScheduleInfo) =>
            (item.hasOwnProperty("weekday") && item.weekday !== "") ||
            (item.hasOwnProperty("date") && item.date !== "")
        );

  useEffect(() => {
    setTypeWeekToSwitch(() => {
      const currentDate = moment();
      const weekNumber = currentDate.isoWeek();
      const isNumeratorWeek =
        (weekNumber + dataScheduleEducator.scheduleResident.weekCorrection) %
          2 ===
        1; // Если номер недели нечетный, то это "numerator"
      setCurrentTypeWeek(isNumeratorWeek ? "numerator" : "denominator");
      return isNumeratorWeek ? "numerator" : "denominator";
    });
  }, []);

  useEffect(() => {
    const updateCurrentTime = () => {
      const date = moment().tz("Asia/Novosibirsk").locale("ru");
      const day = weekdays[date.day() === 0 ? 6 : date.day() - 1];
      const time = date.format("HH:mm:ss");
      const dayExtramuralist = date.format("D MMMM YYYY");
      setCurrentDayForExtramuralist(dayExtramuralist);
      setCurrentDayForResident(day);
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

    const nextSchedule = resultArray.find((schedule) => {
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
  }, [currentTime, resultArray]);

  let updateFavoriteEducator;
  const STORAGE_KEY_SCHEDULE = "favoriteSchedule";

  useEffect(() => {
    if (isConnected) {
      updateFavoriteEducator = async (idEducator: number) => {
        try {
          const storedSchedule = await AsyncStorage.getItem("favoriteSchedule");
          let scheduleEducator = storedSchedule
            ? JSON.parse(storedSchedule)
            : {
                groups: [],
                educators: [],
              };
          const isFavoriteEducator = favoriteEducators.some(
            (educatorFavorite) => educatorFavorite.idEducator === idEducator
          );
          const isFavoriteScheduleEducator = scheduleEducator.educators.some(
            (educator: any) => educator.hasOwnProperty(idEducator)
          );
          const NovosibirskTime = moment.tz("Asia/Novosibirsk");

          const currentTimeCache = NovosibirskTime.format("HH:mm:ss");
          const currentDateCache = NovosibirskTime.format("D MMMM YYYY");
          const lastCacheEntry = {
            currentTimeCache,
            currentDateCache,
          };
          if (isFavoriteScheduleEducator && isFavoriteEducator) {
            const newDataSchedule = {
              ...dataScheduleEducator,
              lastCacheEntry,
            };
            const educatorIndex = scheduleEducator.educators.findIndex(
              (educator: any) =>
                Object.keys(educator)[0] === idEducator.toString()
            );
            if (educatorIndex !== -1) {
              scheduleEducator.educators[educatorIndex][idEducator] =
                newDataSchedule;
              await AsyncStorage.setItem(
                STORAGE_KEY_SCHEDULE,
                JSON.stringify(scheduleEducator)
              );
            }
          } else if (!isFavoriteScheduleEducator && isFavoriteEducator) {
            setFavoriteSchedule(
              dataScheduleEducator,
              idEducator,
              lastCacheEntry
            ); // Добавление новой записи
          }
        } catch (error) {
          console.error("Ошибка при обновлении расписания", error);
        }
      };

      updateFavoriteEducator(selectIdEducator);
    }
  }, [selectIdEducator, dataScheduleEducator]);
  useEffect(() => {
    const fetchData = async () => {
      if (!isConnected) {
        const storedSchedule = await AsyncStorage.getItem("favoriteSchedule");
        if (storedSchedule) {
          const scheduleEducator = JSON.parse(storedSchedule);
          if (scheduleEducator && scheduleEducator.educators) {
            const foundEducator = scheduleEducator.educators.find(
              (item: any) =>
                Object.keys(item)[0] === selectIdEducator.toString()
            );
            if (foundEducator) {
              const lastCacheEntry =
                foundEducator[selectIdEducator.toString()].lastCacheEntry;
              dispatch(setLastCacheEntryEducator(lastCacheEntry));
              // Здесь вы можете использовать lastCacheEntry по вашему усмотрению
            }
          }
        }
      }
    };

    fetchData();
  }, [isConnected, selectIdEducator]);
  return (
    <Container>
      <ToggleContainer>
        <ToggleButton onPress={() => setGroupType("resident")}>
          <ToggleButtonText
            groupType={
              theme === lightTheme
                ? groupType === "resident"
                  ? "#FFFFFF"
                  : "#FFFFFFB2"
                : groupType === "resident"
                ? "#004C6F"
                : "#004C6FB2"
            }
          >
            Очные
          </ToggleButtonText>
        </ToggleButton>
        <ToggleButton onPress={() => setGroupType("extramural")}>
          <ToggleButtonText
            groupType={
              theme === lightTheme
                ? groupType === "extramural"
                  ? "#FFFFFF"
                  : "#FFFFFFB2"
                : groupType === "extramural"
                ? "#004C6F"
                : "#004C6FB2"
            }
          >
            Заочные
          </ToggleButtonText>
        </ToggleButton>
        <ToggleButton onPress={() => setGroupType("session")}>
          <ToggleButtonText
            groupType={
              theme === lightTheme
                ? groupType === "session"
                  ? "#FFFFFF"
                  : "#FFFFFFB2"
                : groupType === "session"
                ? "#004C6F"
                : "#004C6FB2"
            }
          >
            Сессия
          </ToggleButtonText>
        </ToggleButton>
      </ToggleContainer>
      {groupType === "resident" && (
        <TypeWeekContainer>
          <View style={{ flexDirection: "column", flex: 1 }}>
            <Text
              style={{
                color: theme === lightTheme ? "#004C6F" : "#FFFFFF",
                fontSize: screenWidth * 0.0424,
                textAlign: "center",
                fontFamily: "Montserrat-SemiBold",
              }}
            >
              {currentTypeWeek === "numerator" && "Текущая"}
            </Text>
            <TypeWeekButton
              onPress={() => setTypeWeekToSwitch("numerator")}
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
                color: theme === lightTheme ? "#004C6F" : "#FFFFFF",
                fontSize: screenWidth * 0.043,
                textAlign: "center",
                fontFamily: "Montserrat-SemiBold",
              }}
            >
              {currentTypeWeek === "denominator" && "Текущая"}
            </Text>
            <TypeWeekButton
              onPress={() => setTypeWeekToSwitch("denominator")}
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
        </TypeWeekContainer>
      )}

      {!isConnected && (
        <View>
          <NoConnected>Отсутствует соединение.</NoConnected>
          <NoConnected>
            {dataScheduleEducator.lastCacheEntry &&
              "Расписание актуально на " +
                dataScheduleEducator.lastCacheEntry.currentDateCache +
                " " +
                dataScheduleEducator.lastCacheEntry.currentTimeCache}
          </NoConnected>
        </View>
      )}
      {groupType === "resident" && (
        <FlatList
          data={weekdays}
          keyExtractor={(weekday) => weekday}
          initialNumToRender={3}
          maxToRenderPerBatch={10}
          windowSize={10}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: weekday }) => {
            const filteredSchedule =
              typeWeekToSwitch === "numerator"
                ? dataScheduleEducator.scheduleResident.numerator
                : dataScheduleEducator.scheduleResident.denominator;
            const timeFilteredSchedule = filteredSchedule.filter(
              (item) => item.weekday === weekday || item.date === weekday
            );

            if (timeFilteredSchedule.length === 0) {
              return (
                <View key={weekday}>
                  <TextWeekday>{weekday}</TextWeekday>

                  <ContainerPair
                    isColorPair={
                      theme === lightTheme ? "#d9d9d999" : "#46464699"
                    }
                    style={{
                      height: 60,
                      justifyContent: "center",
                    }}
                  >
                    <TextSelfStudy>День самостоятельной работы</TextSelfStudy>
                  </ContainerPair>
                </View>
              );
            }

            return (
              <View key={weekday}>
                <TextWeekday>{weekday}</TextWeekday>
                <FlatList
                  data={timeFilteredSchedule}
                  keyExtractor={(item) => item.idPair.toString()}
                  initialNumToRender={5}
                  maxToRenderPerBatch={10}
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

                    return (
                      <View key={item.idPair}>
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
                          <View>
                            <TextNamePair ellipsizeMode="tail">
                              {item.namePair}
                            </TextNamePair>
                            <View style={{ flexDirection: "row" }}>
                              <ContainerLeft>
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
                                      dispatch(setSelectIdGroup(item.idGroup));
                                      fetchSchedule(
                                        item.idGroup,
                                        item.groupName
                                      );
                                    }
                                  }}
                                >
                                  <TextNameGroup>
                                    {item.groupName &&
                                      "Группа: " + item.groupName}
                                  </TextNameGroup>
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
                                {isCurrent ? (
                                  <TimeToLesson>
                                    До окончания пары: {formattedTimeDifference}
                                  </TimeToLesson>
                                ) : (
                                  item.weekday === currentDayForResident &&
                                  timeArray === start && (
                                    <TimeToLesson>
                                      До начала пары: {timeDifferences}
                                    </TimeToLesson>
                                  )
                                )}
                              </ContainerRight>
                            </View>
                            <Text style={{ textAlign: "center" }}>
                              {item.nameDepartments}
                            </Text>
                            {item.comments && (
                              <CommentsText style={{ textAlign: "center" }}>
                                {item.comments}
                              </CommentsText>
                            )}
                          </View>
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
          {isFullSchedule ? (
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
                    await getScheduleEducator(dispatch, selectIdEducator);
                    dispatch(setIsFullScheduleEducator(!isFullSchedule));
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
                    await getFullScheduleEducatorExtramural(
                      dispatch,
                      selectIdEducator
                    );
                    dispatch(setIsFullScheduleEducator(!isFullSchedule));
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
            data={dataScheduleEducator.scheduleExtramural}
            keyExtractor={(item, index) => index.toString()}
            initialNumToRender={3}
            maxToRenderPerBatch={10}
            windowSize={10}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: isConnected
                ? screenHeight * 0.04
                : screenHeight * 0.13,
            }}
            renderItem={({ item, index }) => (
              <View key={index}>
                <DateText>{item.date && item.date}</DateText>
                <FlatList
                  data={item.schedule}
                  keyExtractor={(item) => item.idPair.toString()}
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
                                  fetchSchedule(item.idGroup, item.groupName);
                                }
                              }}
                            >
                              <TextNameGroup>
                                {item.groupName && "Группа " + item.groupName}
                              </TextNameGroup>
                            </TouchableOpacity>
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
                      </ContainerPair>
                    );
                  }}
                />
              </View>
            )}
          />
        </View>
      )}

      {groupType === "session" &&
      dataScheduleEducator.scheduleResident.session.length !== 0 ? (
        <FlatList
          data={dataScheduleEducator.scheduleResident.session}
          keyExtractor={(item, index) => index.toString()}
          initialNumToRender={3}
          maxToRenderPerBatch={10}
          windowSize={10}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View key={index} style={{ marginTop: screenHeight * 0.02 }}>
              <DateText>{item.date && item.date}</DateText>
              <FlatList
                data={item.schedule}
                keyExtractor={(item) => item.idPair.toString()}
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
                                fetchSchedule(item.idGroup, item.groupName);
                              }
                            }}
                          >
                            <TextNameGroup>
                              {item.groupName && "Группа " + item.groupName}
                            </TextNameGroup>
                          </TouchableOpacity>
                          <TextRoomNumber>
                            {item.roomNumber && "Кабинет № " + item.roomNumber}
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
