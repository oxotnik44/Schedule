import { Reducer } from "redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { removeFavoriteStudentSchedule } from "./favoriteScheduleStudent";

const STORAGE_KEY_GROUPS = "favoriteGroups";
const SET_FAVORITE_GROUPS = "SET_FAVORITE_GROUPS";
const REMOVE_FAVORITE_GROUP = "REMOVE_FAVORITE_GROUP";

interface IFavoriteGroup {
  idGroup: number;
  nameGroup: string;
}

interface IGroupState {
  favoriteGroups: IFavoriteGroup[];
}
const initialFavoriteGroupState: IGroupState = {
  favoriteGroups: [],
};

const favoriteGroupReducer: Reducer<IGroupState> = (
  state = initialFavoriteGroupState,
  action
) => {
  switch (action.type) {
    case SET_FAVORITE_GROUPS:
      return { ...state, favoriteGroups: action.favoriteGroups };
    case REMOVE_FAVORITE_GROUP:
      const updatedGroups = state.favoriteGroups.filter(
        (group) => group.idGroup !== action.idGroup
      );

      removeFavoriteGroup(action.idGroup); // Передаем idGroup
      return { ...state, favoriteGroups: updatedGroups };
    default:
      return state;
  }
};

export const handleAddFavoriteGroup = (
  isFavoriteGroup: boolean,
  idGroup: number,
  nameGroup: string,
  dispatch: Function
) => {
  if (isFavoriteGroup) {
    Alert.alert(
      "Подтверждение удаления",
      "Вы точно хотите удалить группу из избранных?",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Удалить",
          onPress: () => {
            dispatch(removeFavoriteGroupAC(idGroup)),
              removeFavoriteStudentSchedule(idGroup);
          },
        },
      ]
    );
  } else {
    const newGroup = {
      idGroup: idGroup,
      nameGroup: nameGroup,
    };
    setFavoriteGroups(newGroup, dispatch);
  }
};

export const setFavoriteGroups = async (
  newGroup: IFavoriteGroup,
  dispatch: Function
) => {
  try {
    const storedGroups = await AsyncStorage.getItem(STORAGE_KEY_GROUPS);
    const groups = storedGroups ? JSON.parse(storedGroups) : [];
    if (groups.length < 5) {
      groups.push(newGroup);
      await AsyncStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(groups));
      dispatch(setFavoriteGroupsAC(groups));
      Alert.alert("Группа добавлена в избранное");
    } else {
      Alert.alert("Ошибка", "Превышено максимальное число избранных групп");
    }
  } catch (error) {
    console.error("Ошибка сохранения группы", error);
  }
};
export const removeFavoriteGroup = async (idGroup: number) => {
  try {
    const storedGroups = await AsyncStorage.getItem(STORAGE_KEY_GROUPS);
    if (storedGroups) {
      const groups: IFavoriteGroup[] = JSON.parse(storedGroups);
      const updatedGroups = groups.filter((group) => group.idGroup !== idGroup);
      await AsyncStorage.setItem(
        STORAGE_KEY_GROUPS,
        JSON.stringify(updatedGroups)
      );
    }
  } catch (error) {
    console.error("Ошибка удаления избранной группы", error);
  }
};

export const setFavoriteGroupsAC = (favoriteGroups: IFavoriteGroup[]) => ({
  type: SET_FAVORITE_GROUPS,
  favoriteGroups,
});
export const removeFavoriteGroupAC = (idGroup: number) => ({
  type: REMOVE_FAVORITE_GROUP,
  idGroup,
});
export default favoriteGroupReducer;
