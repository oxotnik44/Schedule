import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, ToastAndroid } from "react-native";
import { removeFavoriteStudentSchedule } from "./FavoriteScheduleStudent";

const STORAGE_KEY_GROUPS = "favoriteGroups";

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

const FavoriteGroupSlice = createSlice({
  name: "FavoriteGroup",
  initialState: initialFavoriteGroupState,
  reducers: {
    setFavoriteGroups: (state, action: PayloadAction<IFavoriteGroup[]>) => {
      state.favoriteGroups = action.payload;
    },
    removeFavoriteGroup: (state, action: PayloadAction<number>) => {
      const updatedGroups = state.favoriteGroups.filter(
        (group) => group.idGroup !== action.payload
      );
      removeFavoriteGroupStorage(action.payload); // Переименовано
      state.favoriteGroups = updatedGroups;
    },
  },
});

export const { setFavoriteGroups, removeFavoriteGroup } =
  FavoriteGroupSlice.actions;

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
            dispatch(removeFavoriteGroup(idGroup)),
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
    setFavoriteGroupsStorage(newGroup, dispatch); // Переименовано
  }
};

export const setFavoriteGroupsStorage = async (
  newGroup: IFavoriteGroup,
  dispatch: Function
) => {
  try {
    const storedGroups = await AsyncStorage.getItem(STORAGE_KEY_GROUPS);
    const groups = storedGroups ? JSON.parse(storedGroups) : [];
    if (groups.length < 5) {
      groups.push(newGroup);
      await AsyncStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(groups));
      dispatch(setFavoriteGroups(groups));
      ToastAndroid.show("Группа добавлена в избранное", ToastAndroid.SHORT);
    } else {
      ToastAndroid.show(
        "Превышено максимальное число избранных групп",
        ToastAndroid.SHORT
      );
    }
  } catch (error) {
    console.error("Ошибка сохранения группы", error);
  }
};

export const removeFavoriteGroupStorage = async (idGroup: number) => {
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

export default FavoriteGroupSlice.reducer;
