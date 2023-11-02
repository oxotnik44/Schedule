import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY_SCHEDULE = "favoriteSchedule";

export const setFavoriteSchedule = async (
  newSchedule: any,
  idGroup: number,
  lastCacheEntry: Record<string, string>
) => {
  try {
    const storedSchedule = await AsyncStorage.getItem(STORAGE_KEY_SCHEDULE);
    let scheduleStudent = storedSchedule
      ? JSON.parse(storedSchedule)
      : { groups: [], educators: [] };
    const dataScheduleStudent = {
      ...newSchedule,
      lastCacheEntry,
    };
    scheduleStudent.groups.push({ [idGroup]: dataScheduleStudent });
    console.log(scheduleStudent);
    await AsyncStorage.setItem(
      STORAGE_KEY_SCHEDULE,
      JSON.stringify(scheduleStudent)
    );
    const stored = await AsyncStorage.getItem(STORAGE_KEY_SCHEDULE);
    const storedd = stored ? JSON.parse(stored) : [];
    console.log(storedd);
  } catch (error) {
    console.error("Ошибка сохранения группы", error);
  }
};

export const removeFavoriteStudentSchedule = async (idGroup: number) => {
  try {
    const storedSchedule = await AsyncStorage.getItem(STORAGE_KEY_SCHEDULE);

    if (storedSchedule) {
      const favoriteSchedule = JSON.parse(storedSchedule);
      const updatedGroups = favoriteSchedule.groups.filter(
        (group: any) => !group[idGroup]
      );

      await AsyncStorage.setItem(
        STORAGE_KEY_SCHEDULE,
        JSON.stringify({ ...favoriteSchedule, groups: updatedGroups })
      );
    }
  } catch (error) {
    console.error("Ошибка удаления избранной группы", error);
  }
};
