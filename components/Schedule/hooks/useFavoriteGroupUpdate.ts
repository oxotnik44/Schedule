import { useEffect } from "react";
import { setFavoriteSchedule } from "../../../redux/slices/FavoritesSlice/FavoriteScheduleStudent";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
const STORAGE_KEY_SCHEDULE = "favoriteSchedule";

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
      ({ idGroup: gId }) => gId === idGroup
    );
    const isFavoriteScheduleGroup = scheduleStudent.groups.some((group) =>
      group.hasOwnProperty(idGroup)
    );

    const lastCacheEntry = {
      currentTimeCache: moment.tz("Asia/Novosibirsk").format("HH:mm:ss"),
      currentDateCache: moment.tz("Asia/Novosibirsk").format("D MMMM YYYY"),
    };

    if (isFavoriteGroup) {
      if (isFavoriteScheduleGroup) {
        const groupIndex = scheduleStudent.groups.findIndex(
          (group) => Object.keys(group)[0] === idGroup.toString()
        );
        if (groupIndex !== -1) {
          scheduleStudent.groups[groupIndex][idGroup] = {
            ...dataSchedule,
            lastCacheEntry,
          };
          await AsyncStorage.setItem(
            STORAGE_KEY_SCHEDULE,
            JSON.stringify(scheduleStudent)
          );
        }
      } else {
        setFavoriteSchedule(dataSchedule, idGroup, lastCacheEntry);
      }
    }
  } catch (error) {
    console.error("Ошибка при обновлении расписания", error);
  }
};

const useFavoriteGroupUpdate = (
  selectIdGroup,
  favoriteGroups,
  dataSchedule,
  dispatch,
  isConnected
) => {
  useEffect(() => {
    isConnected &&
      updateFavoriteGroup(
        selectIdGroup,
        favoriteGroups,
        dataSchedule,
        dispatch
      );
  }, [selectIdGroup, dataSchedule, isConnected, favoriteGroups]);
};

export default useFavoriteGroupUpdate;
