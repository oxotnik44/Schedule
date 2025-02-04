import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setLastCacheEntryStudent } from "../../../redux/slices/ScheduleStudentInfoSlice";
import { setLastCacheEntryEducator } from "../../../redux/slices/ScheduleEducatorInfoSlice";

const useStoredSchedule = (
  selectIdGroup, // идентификатор группы (студента)
  selectIdEducator, // идентификатор преподавателя
  isConnected,
  dispatch
) => {
  useEffect(() => {
    const STORAGE_KEY_SCHEDULE = "favoriteSchedule";

    if (!isConnected) {
      (async () => {
        try {
          const storedSchedule = await AsyncStorage.getItem(
            STORAGE_KEY_SCHEDULE
          );
          if (storedSchedule) {
            const parsedSchedule = JSON.parse(storedSchedule);

            // Если передан идентификатор группы и в расписании есть данные для групп
            if (selectIdGroup && parsedSchedule.groups) {
              const foundGroup = parsedSchedule.groups.find(
                (item) => Object.keys(item)[0] === selectIdGroup.toString()
              );
              if (foundGroup) {
                dispatch(
                  setLastCacheEntryStudent(
                    foundGroup[selectIdGroup].lastCacheEntry
                  )
                );
              }
            }

            // Если передан идентификатор преподавателя и в расписании есть данные для преподавателей
            if (selectIdEducator && parsedSchedule.educators) {
              const foundEducator = parsedSchedule.educators.find(
                (item) => Object.keys(item)[0] === selectIdEducator.toString()
              );
              console.log(foundEducator)

              if (foundEducator) {
                const lastCacheEntry =
                  foundEducator[selectIdEducator.toString()].lastCacheEntry;
                  console.log(lastCacheEntry)
                dispatch(setLastCacheEntryEducator(lastCacheEntry));
                // Здесь вы можете использовать lastCacheEntry по вашему усмотрению
              }
            }
          }
        } catch (error) {
          console.error(
            "Ошибка при получении расписания из AsyncStorage:",
            error
          );
        }
      })();
    }
  }, [isConnected, selectIdGroup, selectIdEducator, dispatch]);
};

export default useStoredSchedule;
