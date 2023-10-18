import moment from "moment";
import "moment/locale/ru";
import "moment-timezone";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  FlatList,
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
import { setIsFullScheduleStudent } from "../../redux/reducers/scheduleStudentInfo";
import { useNavigation } from "@react-navigation/native";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

interface IScheduleInfo {
  idPair: number;
  comments: string;
  roomNumber: string;
  weekday: string;
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
  comments: string;
  roomNumber: string | null;
  numberPair: string;
  typePair: string;
  namePair: string;
  idEducator: number;
  nameEducator: string;
  fullNameEducator: string;
  date: string | null;
}
interface ScheduleState {
  scheduleInfoStudentReducer: {
    dataSchedule: {
      groupType: string;
      scheduleResident: {
        numerator: IScheduleInfo[];
        denominator: IScheduleInfo[];
      };
      scheduleExtramural: {
        date: string;
        schedule: IScheduleExtramuralInfo[];
      }[];
    };
    selectIdEducator: number;
    selectIdGroup: number;
    isFullSchedule: boolean;
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
const Schedule = ({ navigation }: ScheduleProps) => {
  const theme = useSelector((state: ITheme) => state.settingsReducer.theme);
  moment.tz.setDefault("Asia/Novosibirsk");
  const dispatch = useDispatch();

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
  const isFullSchedule = useSelector(
    (state: ScheduleState) => state.scheduleInfoStudentReducer.isFullSchedule
  );

  const [typeWeek, setTypeWeek] = useState("");
  const [currentTypeWeek, setCurrentTypeWeek] = useState<
    "numerator" | "denominator"
  >();
  const [currentDayForResident, setСurrentDayForResident] =
    useState<string>("Понедельник");
  const [currentDayForExtramuralist, setCurrentDayForExtramuralist] =
    useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("9:59:58");
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

  useEffect(() => {
    setTypeWeek(() => {
      const currentDate = moment();
      const dayOfWeek = currentDate.weekday();
      const isNumeratorWeek = dayOfWeek <= currentDate.date() % 7;
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

    for (let i = 0; i < resultArray.length; i++) {
      const scheduleParts = resultArray[i].split("-");
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
  }, [currentTime, resultArray]);

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

  const getFilteredSchedule = () => {
    const filteredSchedule =
      typeWeek === "numerator"
        ? dataSchedule.scheduleResident.numerator
        : dataSchedule.scheduleResident.denominator;

    return weekdays.map((weekday) =>
      filteredSchedule.filter(
        (item) => item.weekday === weekday || item.date === weekday
      )
    );
  };

  weekdays.forEach((weekday, index) => {
    const timeFilteredSchedule = getFilteredSchedule()[index];
    timeFilteredSchedule.forEach((scheduleItem) => {
      const [start] = scheduleItem.numberPair.split("-");

      if (scheduleItem.weekday === currentDayForResident) {
        resultArray.push(start);
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
                  color: theme === lightTheme ? "#004C6F" : "#FFFFFF",
                  fontSize: screenWidth * 0.05,
                  textAlign: "center",
                  fontFamily: "Montserrat-SemiBold",
                }}
              >
                {currentTypeWeek === "numerator" && "Текущая"}
              </Text>
              <TypeWeekButton
                onPress={() => setTypeWeek("numerator")}
                activeOpacity={0.9}
              >
                <TypeWeekText
                  typeWeek={
                    theme === lightTheme
                      ? typeWeek === "numerator"
                        ? "#FFFFFF"
                        : "#FFFFFFB2"
                      : typeWeek === "numerator"
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
                  fontSize: screenWidth * 0.05,
                  textAlign: "center",
                  fontFamily: "Montserrat-SemiBold",
                }}
              >
                {currentTypeWeek === "denominator" && "Текущая"}
              </Text>
              <TypeWeekButton
                onPress={() => setTypeWeek("denominator")}
                activeOpacity={0.9}
              >
                <TypeWeekText
                  typeWeek={
                    theme === lightTheme
                      ? typeWeek === "denominator"
                        ? "#FFFFFF"
                        : "#FFFFFFB2"
                      : typeWeek === "denominator"
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

        <ScrollView>
          <View>
            {groupType === "resident" ? (
              <View>
                {weekdays.map((weekday, index) => {
                  const timeFilteredSchedule = getFilteredSchedule()[index];

                  if (timeFilteredSchedule.length === 0) {
                    return (
                      <View key={weekday}>
                        <Text
                          style={{
                            color: theme === lightTheme ? "#004C6F" : "#FFFFFF",
                            fontSize: screenWidth * 0.06,
                            textAlign: "center",
                            marginBottom: screenHeight * 0.01,
                            fontFamily: "Montserrat-Bold",
                          }}
                        >
                          {weekday}
                        </Text>

                        <ContainerPair
                          isColorPair={
                            theme === lightTheme ? "#d9d9d999" : "#46464699"
                          }
                          style={{
                            height: 60,
                            alignItems: "center", // Выравнивание по центру по горизонтали
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
                    <View key={weekday}>
                      <Text
                        style={{
                          fontSize: screenWidth * 0.06,
                          textAlign: "center",
                          color: theme === lightTheme ? "#004C6F" : "#FFFFFF",
                          marginBottom: screenHeight * 0.01,
                          fontFamily: "Montserrat-Bold",
                        }}
                      >
                        {weekday}
                      </Text>
                      {timeFilteredSchedule.map((item) => {
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
                              <TextNamePair ellipsizeMode="tail">
                                {item.namePair}
                              </TextNamePair>
                              <View
                                style={{
                                  flexDirection: "row",
                                }}
                              >
                                <ContainerLeft>
                                  <TouchableOpacity
                                    onPress={() => {
                                      dispatch(
                                        setSelectIdEducator(item.idEducator)
                                      );
                                      fetchScheduleEducator(
                                        item.fullNameEducator,
                                        item.idEducator
                                      );
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
                                  {weekday === currentDayForResident &&
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
                                  {item.comments}
                                </CommentsText>
                              )}
                            </ContainerPair>
                          </View>
                        );
                      })}
                    </View>
                  );
                })}
              </View>
            ) : (
              <View>
                {isFullSchedule ? (
                  <View style={{ paddingHorizontal: screenWidth * 0.04 }}>
                    <Text
                      style={{
                        fontFamily: "Montserrat-Bold",
                        color: "#004c6f",
                        marginTop: screenHeight * 0.01,
                        fontSize: screenWidth * 0.04,
                      }}
                    >
                      Что бы скрыть прошедшие пары нажмите
                    </Text>
                    <BtnGetScheduleExtramural
                      onPress={async () => {
                        await getSchedule(selectIdGroup, dispatch);
                        dispatch(setIsFullScheduleStudent(!isFullSchedule));
                      }}
                    >
                      <Text
                        style={{
                          fontSize: screenWidth * 0.04,
                          color: "white",
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
                        color: "#004c6f",
                        marginTop: screenHeight * 0.01,
                        fontSize: screenWidth * 0.04,
                      }}
                    >
                      Скрыты уже прошедшие занятия. Чтобы увидеть расписание
                      ранее сегодняшней даты нажмите
                    </Text>
                    <BtnGetScheduleExtramural
                      onPress={async () => {
                        await getFullScheduleStudentExtramuralist(
                          dispatch,
                          selectIdGroup
                        );
                        dispatch(setIsFullScheduleStudent(!isFullSchedule));
                      }}
                    >
                      <Text
                        style={{
                          fontSize: screenWidth * 0.04,
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        Здесь
                      </Text>
                    </BtnGetScheduleExtramural>
                  </View>
                )}
                {dataSchedule.scheduleExtramural.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <DateText>{item.date && item.date}</DateText>

                    {item.schedule.map((item, index) => {
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
                                  onPress={() =>
                                    fetchScheduleEducator(
                                      item.fullNameEducator,
                                      item.idEducator
                                    )
                                  }
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
                              {item.comments}
                            </CommentsText>
                          )}
                        </ContainerPair>
                      );
                    })}
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
        {/* <FlatList
          data={visibleData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => renderItemSchedule(item.date, item.schedule)} // Обернули вызов renderItemSchedule в анонимную функцию
          onEndReached={loadMoreData} // Вызывается при достижении конца списка
          onEndReachedThreshold={0.1} // Когда достигнутый порог составляет 10% от конца списка
        /> */}
      </Container>
    </ThemeProvider>
  );
};

export default Schedule;
