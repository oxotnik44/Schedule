import moment from "moment";
import "moment/locale/ru";
import "moment-timezone";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { Dimensions } from "react-native";
import {
  BtnGetScheduleExtramural,
  CommentsText,
  Container,
  ContainerLeft,
  ContainerPair,
  ContainerRight,
  DateText,
  TextNameGroup,
  TextNamePair,
  TextNumberPair,
  TextRoomNumber,
  TextSelfStudy,
  TextTypePair,
  TextWeekday,
  ToggleButton,
  ToggleButtonText,
  ToggleContainer,
  TypeWeekButton,
  TypeWeekContainer,
  TypeWeekText,
} from "./ScheduleStyle";
import { setNameGroup } from "../../redux/reducers/groupsInfoReducer";
import {
  getFullScheduleEducatorExtramural,
  getFullScheduleStudentExtramuralist,
  getSchedule,
  getScheduleEducator,
} from "../../api/apiSchedule";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../Navigate";
import { lightTheme } from "../../redux/reducers/settingsReducer";
import { setIsFullScheduleEducator } from "../../redux/reducers/scheduleEducatorInfo";
import { setSelectIdGroup } from "../../redux/reducers/scheduleStudentInfo";

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
  numberPair: string;
  typePair: string;
  namePair: string;
  idEducator: number;
  nameDepartments: string;
  nameEducator: string;
  fullNameEducator: string;
  date: string | null;
}
interface ScheduleState {
  scheduleInfoEducatorReducer: {
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
  settingsReducer: {
    theme: any;
  };
};
const ScheduleEducator = ({ navigation }: ScheduleEducatorProps) => {
  const theme = useSelector((state: ITheme) => state.settingsReducer.theme);

  moment.tz.setDefault("Asia/Novosibirsk");
  const dataScheduleEducator = useSelector(
    (state: ScheduleState) => state.scheduleInfoEducatorReducer.dataSchedule
  );
  const selectIdEducator = useSelector(
    (state: ScheduleState) => state.scheduleInfoEducatorReducer.selectIdEducator
  );
  const [groupType, setGroupType] = useState<"resident" | "extramural">(
    "resident"
  );
  const handleSwitchGroupType = (type: "resident" | "extramural") => {
    setGroupType(type);
  };
  const [typeWeek, setTypeWeek] = useState("");
  const [currentTypeWeek, setCurrentTypeWeek] = useState<
    "numerator" | "denominator"
  >();
  useEffect(() => {
    // Обновление значения typeWeek при изменении dispatch
    setTypeWeek(() => {
      const currentDate = moment();
      const isNumeratorWeek = currentDate.weekday() <= currentDate.date() % 7;
      setCurrentTypeWeek(isNumeratorWeek ? "numerator" : "denominator");
      return isNumeratorWeek ? "numerator" : "denominator";
    });
  }, [dataScheduleEducator]);
  const dispatch = useDispatch();
  const fetchSchedule = async (idGroup: number, groupName: string) => {
    try {
      dispatch(setNameGroup(groupName));
      await getSchedule(idGroup, dispatch);
      navigation.navigate("Schedule");
    } catch (error) {
      console.log(error);
    }
  };

  const weekdays = [
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ];

  const [currentDayForResident, setCurrentDayForResident] =
    useState<string>("");
  const [currentDayForExtramuralist, setCurrentDayForExtramuralist] =
    useState<string>("");
  const isFullSchedule = useSelector(
    (state: ScheduleState) => state.scheduleInfoEducatorReducer.isFullSchedule
  );
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateCurrentTime = () => {
      const date = moment().tz("Asia/Novosibirsk").locale("ru");
      const day = weekdays[date.day() === 0 ? 6 : date.day() - 1];
      const time = date.format("HH:mm");
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

  let hasWeekday: any = null;
  if (typeWeek === "numerator") {
    hasWeekday = dataScheduleEducator.scheduleResident.numerator.some(
      (item: IScheduleInfo) =>
        (item.hasOwnProperty("weekday") && item.weekday !== "") ||
        (item.hasOwnProperty("date") && item.date !== "")
    );
  } else {
    hasWeekday = dataScheduleEducator.scheduleResident.denominator.some(
      (item: IScheduleInfo) =>
        (item.hasOwnProperty("weekday") && item.weekday !== "") ||
        (item.hasOwnProperty("date") && item.date !== "")
    );
  }

  return (
    <Container>
      <ToggleContainer>
        <ToggleButton onPress={() => handleSwitchGroupType("resident")}>
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
        <ToggleButton onPress={() => handleSwitchGroupType("extramural")}>
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
      </ToggleContainer>
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
        {groupType === "resident" ? (
          <View>
            {weekdays.map((weekday) => {
              const filteredSchedule =
                typeWeek === "numerator"
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
                  {timeFilteredSchedule.map((item, index) => {
                    const [start, end] = item.numberPair.split("-");
                    const startTime = moment(start, "HH:mm");
                    const endTime = moment(end, "HH:mm");

                    const isCurrent =
                      currentDayForResident ===
                        (hasWeekday ? item.weekday : item.date) &&
                      moment(currentTime, "HH:mm").isSameOrAfter(startTime) &&
                      moment(currentTime, "HH:mm").isSameOrBefore(endTime);
                    const isColorPair = isCurrent;

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
                                    dispatch(setSelectIdGroup(item.idGroup));
                                    fetchSchedule(item.idGroup, item.groupName);
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
                  })}
                </View>
              );
            })}
          </View>
        ) : (
          <View>
            {isFullSchedule ? (
              <View style={{ paddingHorizontal: screenWidth * 0.05 }}>
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
                    await getScheduleEducator(dispatch, selectIdEducator);
                    dispatch(setIsFullScheduleEducator(!isFullSchedule));
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
                  Скрыты уже прошедшие занятия. Чтобы увидеть расписание ранее
                  сегодняшней даты нажмите
                </Text>
                <BtnGetScheduleExtramural
                  onPress={async () => {
                    await getFullScheduleEducatorExtramural(
                      dispatch,
                      selectIdEducator
                    );
                    dispatch(setIsFullScheduleEducator(!isFullSchedule));
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

            {dataScheduleEducator.scheduleExtramural.map((item, index) => (
              <View key={index}>
                <DateText>{item.date && item.date}</DateText>
                {item.schedule.map((item, index) => {
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
                            onPress={() =>
                              fetchSchedule(item.idGroup, item.groupName)
                            }
                          >
                            <TextNameGroup>
                              {item.groupName && "Группа " + item.groupName}
                            </TextNameGroup>
                          </TouchableOpacity>
                          <TextRoomNumber>
                            {item.roomNumber && "Кабинет № " + item.roomNumber}
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
                })}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </Container>
  );
};

export default ScheduleEducator;
