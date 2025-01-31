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
import { fetchSchedule } from "./api/groupApi";
import useWeekTypeSwitcher from "./hooks/useWeekTypeSwitcher";
import { hasWeekdayInSchedule } from "./Helpers/scheduleHelpers";
import useCurrentDateTime from "./hooks/useCurrentDateTime";
import useScheduleTimeDiff from "./hooks/useScheduleTimeDiff";
import TypeWeekPanel from "./components/ResidentTypeWeekPanel";
import WeekTypeSelector from "./components/WeekTypeSelector";
import { NoConnectionMessage } from "./ui/NoConnectionMessage";
import ResidentScheduleList from "./components/ResidentScheduleList";
import ExtramuralAndSessionSchedule from "./components/ExtramuralAndSessionSchedule";

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
  useCurrentDateTime;
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

  hasWeekday = hasWeekdayInSchedule(dataScheduleEducator);
  useWeekTypeSwitcher(
    dataScheduleEducator,
    setCurrentTypeWeek,
    setTypeWeekToSwitch
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
  const [latestEndTime, setLatestEndTime] = useState(moment("00:00", "HH:mm"));

  useEffect(() => {
    let tempLatestEndTime = moment("00:00", "HH:mm"); // Начальное время для сравнения

    filteredSchedules.forEach((schedule) => {
      if (schedule.length > 0) {
        schedule.forEach((item) => {
          const [start, end] = item.numberPair.split("-"); // Разделяем время начала и окончания
          const endTime = moment(end, "HH:mm"); // Преобразуем время окончания в moment

          // Если текущее время окончания позже самого большого, обновляем его
          if (endTime.isAfter(tempLatestEndTime)) {
            tempLatestEndTime = endTime;
          }
        });
      }
    });

    // Обновляем состояние с найденным самым поздним временем окончания
    setLatestEndTime(tempLatestEndTime);
  }, []); // В зависимости от filteredSchedules
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
      />

      {groupType === "resident" && (
        <WeekTypeSelector
          currentTypeWeek={currentTypeWeek}
          dataScheduleEducator={dataScheduleEducator}
          setTypeWeekToSwitch={setTypeWeekToSwitch}
          typeWeekToSwitch={typeWeekToSwitch}
          theme={theme}
          screenWidth={screenWidth}
        />
      )}

      {!isConnected && (
        <NoConnectionMessage
          lastCacheEntry={dataScheduleEducator.lastCacheEntry}
        />
      )}
      {groupType === "resident" && (
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
                                fetchSchedule(
                                  item.idGroup,
                                  item.groupName,
                                  dispatch,
                                  navigation
                                );
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
