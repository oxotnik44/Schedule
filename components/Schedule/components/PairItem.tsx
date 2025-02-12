import { FC } from "react";
import { View, TouchableOpacity, ToastAndroid } from "react-native";
import { useDispatch } from "react-redux";
import { setSelectIdEducator } from "../../../redux/slices/ScheduleEducatorInfoSlice";
import { fetchScheduleEducator } from "../api/educatorApi";
import {
  ContainerLeft,
  ContainerRight,
  TextNameEducator,
  TextNumberPair,
  TextRoomNumber,
  TextTypePair,
  TimeToLesson,
} from "../ScheduleStyle";
import { fetchSchedule } from "../api/groupApi";
import moment from "moment";

interface ScheduleItemProps {
  item: any; // Желательно заменить `any` на точный тип данных
  textColor: string;
  isConnected: boolean;
  isCurrent: boolean;
  matchingIdPairs: any[]; // Желательно указать точный тип
  currentDayForResident: string;
  timeArray: string;
  start: string;
  formattedTimeDifference: string;
  timeDifferences: string;
  navigation: any; // Указать точный тип для React Navigation
  isResident: boolean;
  isEducator: boolean;
  currentTime?: string;
  latestEndTime?: moment.Moment;
}

export const PairItem: FC<ScheduleItemProps> = ({
  item,
  textColor,
  isConnected,
  isCurrent,
  matchingIdPairs,
  currentDayForResident,
  timeArray,
  start,
  formattedTimeDifference,
  timeDifferences,
  navigation,
  isResident,
  isEducator,
  currentTime,
  latestEndTime,
}) => {
  const momentTime = moment(currentTime, "HH:mm:ss");
  const dispatch = useDispatch();
  const handlePress = () => {
    if (!isConnected) {
      ToastAndroid.show("Нет соединения с интернетом", ToastAndroid.SHORT);
    } else {
      dispatch(setSelectIdEducator(item.idEducator));
      console.log(isEducator)
      if (isEducator) {
        fetchSchedule(item.idGroup, item.groupName, dispatch, navigation);
      } else {
        console.log(item)
        fetchScheduleEducator(
          item.fullNameEducator,
          item.idEducator,
          dispatch,
          navigation
        );
      }
    }
  };
  return (
    <View style={{ flexDirection: "row" }}>
      <ContainerLeft>
        <TouchableOpacity onPress={handlePress}>
          <TextNameEducator style={{ color: textColor }}>
            {item.nameEducator &&
              item.nameEducator + " " + item.regaliaEducator}
            {item.groupName && item.groupName}
          </TextNameEducator>
        </TouchableOpacity>
        <TextRoomNumber style={{ color: textColor }}>
          {item.roomNumber && "Кабинет №" + item.roomNumber}
        </TextRoomNumber>
      </ContainerLeft>

      <ContainerRight>
        <TextNumberPair style={{ color: textColor }}>
          {item.numberPair && item.numberPair}
        </TextNumberPair>
        {!item.weeks && item.typePair && (
          <TextTypePair style={{ color: textColor }}>
            {"Тип пары: " + item.typePair}
          </TextTypePair>
        )}
        {isResident &&
          textColor !== "#a0a0a0" &&
          (isCurrent ? (
            <TimeToLesson>
              До окончания пары: {formattedTimeDifference}
            </TimeToLesson>
          ) : (
            item.weekday === currentDayForResident &&
            timeArray === start &&
            momentTime < latestEndTime && (
              <TimeToLesson>До начала пары: {timeDifferences}</TimeToLesson>
            )
          ))}
      </ContainerRight>
    </View>
  );
};
