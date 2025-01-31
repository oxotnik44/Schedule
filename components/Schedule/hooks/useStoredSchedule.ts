import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setLastCacheEntryStudent } from "../../../redux/slices/ScheduleStudentInfoSlice";
const STORAGE_KEY_SCHEDULE = "favoriteSchedule";

const useStoredSchedule = (selectIdGroup, isConnected, dispatch) => {
  useEffect(() => {
    if (!isConnected) {
      (async () => {
        const storedSchedule = await AsyncStorage.getItem(STORAGE_KEY_SCHEDULE);
        const scheduleStudent = storedSchedule && JSON.parse(storedSchedule);
        const foundGroup = scheduleStudent?.groups?.find(
          (item) => Object.keys(item)[0] === selectIdGroup.toString()
        );
        foundGroup &&
          dispatch(
            setLastCacheEntryStudent(foundGroup[selectIdGroup].lastCacheEntry)
          );
      })();
    }
  }, [isConnected, selectIdGroup, dispatch]);
};

export default useStoredSchedule;
