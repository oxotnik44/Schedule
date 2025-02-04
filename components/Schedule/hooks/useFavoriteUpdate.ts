import { useEffect } from "react";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setFavoriteSchedule } from "../../../redux/slices/FavoritesSlice/FavoriteScheduleStudent";

const STORAGE_KEY_SCHEDULE = "favoriteSchedule";

const updateFavoriteEntity = async (
  id,
  favoriteList,
  dataSchedule,
  dispatch,
  scheduleKey
) => {
  try {
    const storedSchedule = await AsyncStorage.getItem(STORAGE_KEY_SCHEDULE);
    let schedule = storedSchedule
      ? JSON.parse(storedSchedule)
      : { groups: [], educators: [] };

    // Проверка избранного: для групп — сравнение по idGroup, для преподавателей — по idEducator
    const isFavorite =
      scheduleKey === "groups"
        ? favoriteList.some(({ idGroup }) => idGroup === id)
        : favoriteList.some(({ idEducator }) => idEducator === id);

    // Проверка, есть ли уже запись для данного id в расписании
    const isFavoriteSchedule = schedule[scheduleKey].some((entity) =>
      entity.hasOwnProperty(id)
    );

    // Формирование времени и даты в часовом поясе "Asia/Novosibirsk"
    const tzTime = moment.tz("Asia/Novosibirsk");
    const lastCacheEntry = {
      currentTimeCache: tzTime.format("HH:mm:ss"),
      currentDateCache: tzTime.format("D MMMM YYYY"),
    };

    if (isFavorite) {
      if (isFavoriteSchedule) {
        const index = schedule[scheduleKey].findIndex(
          (entity) => Object.keys(entity)[0] === id.toString()
        );
        if (index !== -1) {
          schedule[scheduleKey][index][id] = {
            ...dataSchedule,
            lastCacheEntry,
          };
          await AsyncStorage.setItem(
            STORAGE_KEY_SCHEDULE,
            JSON.stringify(schedule)
          );
        }
      } else {
        // Добавление новой записи через существующую функцию
        setFavoriteSchedule(dataSchedule, id, lastCacheEntry);
      }
    }
  } catch (error) {
    console.error(
      `Ошибка при обновлении расписания ${
        scheduleKey === "groups" ? "группы" : "преподавателя"
      }`,
      error
    );
  }
};

// Универсальный хук, который принимает 8 аргументов
const useFavoriteUpdate = (
  selectIdGroup = null,
  favoriteGroups = [],
  dataScheduleGroup,
  selectIdEducator = null,
  favoriteEducators = [],
  dataScheduleEducator,
  dispatch,
  isConnected
) => {
  useEffect(() => {
    if (isConnected) {
      if (selectIdGroup) {
        updateFavoriteEntity(
          selectIdGroup,
          favoriteGroups,
          dataScheduleGroup,
          dispatch,
          "groups"
        );
      }
      if (selectIdEducator) {
        updateFavoriteEntity(
          selectIdEducator,
          favoriteEducators,
          dataScheduleEducator,
          dispatch,
          "educators"
        );
      }
    }
  }, [
    isConnected,
    selectIdGroup,
    favoriteGroups,
    dataScheduleGroup,
    selectIdEducator,
    favoriteEducators,
    dataScheduleEducator,
  ]);
};

export default useFavoriteUpdate;
