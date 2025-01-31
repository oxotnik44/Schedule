import { getScheduleEducator } from "../../../api/apiSchedule";
import { setNameEducator } from "../../../redux/slices/EducatorSlice";

export const fetchScheduleEducator = async (
  fullNameEducator: string,
  idEducator: number,
  dispatch: any,
  navigation: any
) => {
  try {
    dispatch(setNameEducator(fullNameEducator));
    await getScheduleEducator(dispatch, idEducator);
    navigation.navigate("ScheduleEducator");
  } catch (error) {
    console.error("Error fetching educator schedule:", error);
  }
};
