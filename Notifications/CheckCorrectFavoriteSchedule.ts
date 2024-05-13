import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSchedule } from "../api/apiSchedule";
import moment from "moment";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { sendNotification } from "./Notifications";

const STORAGE_KEY_SCHEDULE = "favoriteSchedule";
const STORAGE_KEY_FAVORITE_GROUPS = "favoriteGroups";
interface IScheduleInfo {
  idPair: number;
  roomNumber: string | null;
  weekday: string;
  numberPair: string;
  typePair: string;
  namePair: string;
  nameDepartments: string;
  groupName: string;
  nameGroup: string;
  idEducator: number;
  nameEducator: string;
  fullNameEducator: string;
  regaliaEducator: string;
  date: string | null;
}
const currentDate = moment();
const nextDay =
  currentDate.add(1, "day").format("dddd").charAt(0).toUpperCase() +
  currentDate.format("dddd").slice(1);
const previousDate = moment().subtract(1, "days").format("DD MMMM YYYY");
// const nextDay = "Пятница";
const weekNumber = currentDate.isoWeek();

export const checkCorrectFavoriteSchedule = async (dispatch: Function) => {
  try {
    const storedSchedule = await AsyncStorage.getItem(STORAGE_KEY_SCHEDULE);
    const storedGroups = await AsyncStorage.getItem(
      STORAGE_KEY_FAVORITE_GROUPS
    );
    if (!storedSchedule || !storedGroups) return;

    const presentScheduleStudent = JSON.parse(storedSchedule);

    const parseStoredGroups = JSON.parse(storedGroups);

    const groups = presentScheduleStudent.groups;
    const unchangedGroups: string[] = [];
    for (const group of groups) {
      const groupId = Object.keys(group)[0];
      const dataGroup = group[groupId];
      const groupType = dataGroup.groupType;
      const nameGroup = getNameFavoriteGroup(parseStoredGroups, groupId);

      if (groupType === "resident") {
        const presentScheduleByWeekday: { [key: string]: IScheduleInfo[] } = {
          Понедельник: [],
          Вторник: [],
          Среда: [],
          Четверг: [],
          Пятница: [],
          Суббота: [],
        };

        const presentGroupWeekType = checkGroupType(dataGroup.scheduleResident);
        dataGroup.scheduleResident[presentGroupWeekType].forEach(
          (item: any) => {
            presentScheduleByWeekday[item.weekday].push(item);
          }
        );

        const currentSchedule = await getSchedule(
          Number(groupId),
          dispatch,
          nameGroup,
          true
        );
        const currentTypeWeek = checkGroupType(
          currentSchedule.scheduleResident
        );
        const currentScheduleByWeekday: { [key: string]: IScheduleInfo[] } = {
          Понедельник: [],
          Вторник: [],
          Среда: [],
          Четверг: [],
          Пятница: [],
          Суббота: [],
        };
        currentSchedule.scheduleResident[currentTypeWeek].forEach(
          (item: any) => {
            currentScheduleByWeekday[item.weekday].push(item);
          }
        );
        const presentScheduleNextDay = presentScheduleByWeekday[nextDay];
        const currentScheduleNextDay = currentScheduleByWeekday[nextDay];

        if (
          JSON.stringify(presentScheduleNextDay) !==
          JSON.stringify(currentScheduleNextDay)
        ) {
          unchangedGroups.push(nameGroup);
        } else {
        }
      } else if (
        groupType === "extramural" &&
        moment().format("DD MMMM YYYY") === previousDate
      ) {
        const presentSchedule: { [key: string]: any } = {};
        dataGroup.scheduleExtramural.forEach((scheduleItem: any) => {
          // Извлекаем дату из текущего элемента
          const scheduleDate = scheduleItem.date;
          // Записываем расписание в объект по ключу - дате
          presentSchedule[scheduleDate] = scheduleItem.schedule;
        });
        const currentSchedule = await getSchedule(
          Number(groupId),
          dispatch,
          nameGroup,
          true
        );
        const currentScheduleByData: { [key: string]: IScheduleInfo[] } = {};
        currentSchedule.scheduleExtramural.forEach((scheduleItem: any) => {
          // Извлекаем дату из текущего элемента
          const scheduleDate = scheduleItem.date;

          // Записываем расписание в объект по ключу - дате
          currentScheduleByData[scheduleDate] = scheduleItem.schedule;
        });

        const presentScheduleNextDay =
          presentSchedule[Object.keys(presentSchedule)[0]];
        const currentScheduleNextDay =
          currentScheduleByData[Object.keys(currentScheduleByData)[0]];
        if (
          JSON.stringify(presentScheduleNextDay) !==
          JSON.stringify(currentScheduleNextDay)
        ) {
          unchangedGroups.push(nameGroup);
        } else {
        }
      }
    }
    return unchangedGroups;
    // console.log("Группы, в которых расписание изменилось:", unchangedGroups);
  } catch (err) {
    console.error(err);
  }
};
const getNameFavoriteGroup = (dataFavoriteGroups: any, groupId: string) => {
  let groupName = "";
  dataFavoriteGroups.forEach((group: any) => {
    if (group.idGroup.toString() === groupId) {
      groupName = group.nameGroup;
    }
  });
  return groupName;
};

const checkGroupType = (dataSchedule: any) => {
  const isNumeratorWeek = (weekNumber + dataSchedule.weekCorrection) % 2 === 1;
  return isNumeratorWeek ? "numerator" : "denominator";
};
