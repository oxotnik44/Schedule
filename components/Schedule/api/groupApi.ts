import { getSchedule } from "../../../api/apiSchedule";
import { setNameGroup } from "../../../redux/slices/GroupsInfoSlice";

export const fetchSchedule = async (
  idGroup: number,
  groupName: string,
  dispatch: any,
  navigation: any
) => {
  try {
    dispatch(setNameGroup(groupName));
    await getSchedule(idGroup, dispatch, groupName, false);
    navigation.navigate("Schedule");
  } catch (error) {
    console.log(error);
  }
};
