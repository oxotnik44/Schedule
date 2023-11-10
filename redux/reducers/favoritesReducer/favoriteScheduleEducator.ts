import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY_SCHEDULE = "favoriteSchedule";

export const setFavoriteSchedule = async (
  newSchedule: any,
  idEducator: number,
  lastCacheEntry: any
) => {
  try {
    const storedSchedule = await AsyncStorage.getItem(STORAGE_KEY_SCHEDULE);
    let scheduleEducator = storedSchedule
      ? JSON.parse(storedSchedule)
      : { groups: [], educators: [] };
    const dataScheduleEducator = {
      ...newSchedule,
      lastCacheEntry,
    };
    scheduleEducator.educators.push({ [idEducator]: dataScheduleEducator });
    console.log(scheduleEducator);
    await AsyncStorage.setItem(
      STORAGE_KEY_SCHEDULE,
      JSON.stringify(scheduleEducator)
    );

    const stored = await AsyncStorage.getItem(STORAGE_KEY_SCHEDULE);
    const storedd = stored ? JSON.parse(stored) : [];
    console.log(storedd);
  } catch (error) {
    console.error("Ошибка сохранения группы", error);
  }
};

export const removeFavoriteEducatorSchedule = async (idEducator: number) => {
  try {
    const storedSchedule = await AsyncStorage.getItem(STORAGE_KEY_SCHEDULE);

    if (storedSchedule) {
      const favoriteSchedule = JSON.parse(storedSchedule);
      const updatedEducators = favoriteSchedule.educators.filter(
        (educator: any) => !educator[idEducator]
      );

      await AsyncStorage.setItem(
        STORAGE_KEY_SCHEDULE,
        JSON.stringify({ ...favoriteSchedule, educators: updatedEducators })
      );
    }
  } catch (error) {
    console.error("Ошибка удаления избранного преподавателя", error);
  }
};
