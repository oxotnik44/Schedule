import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { removeFavoriteEducatorSchedule } from "./FavoriteScheduleEducator";

const STORAGE_KEY_EDUCATOR = "favoriteEducators";

interface IFavoriteEducator {
  idEducator: number;
  nameEducator: string;
}

interface IEducatorState {
  favoriteEducators: IFavoriteEducator[];
}

const initialFavoritesState: IEducatorState = {
  favoriteEducators: [],
};

const FavoriteEducatorSlice = createSlice({
  name: "FavoriteEducator",
  initialState: initialFavoritesState,
  reducers: {
    setFavoriteEducator: (
      state,
      action: PayloadAction<IFavoriteEducator[]>
    ) => {
      state.favoriteEducators = action.payload;
    },
    removeFavoriteEducator: (state, action: PayloadAction<number>) => {
      const updatedEducator = state.favoriteEducators.filter(
        (educator) => educator.idEducator !== action.payload
      );
      removeFavoriteEducatorStorage(action.payload);
      state.favoriteEducators = updatedEducator;
    },
  },
});

export const { setFavoriteEducator, removeFavoriteEducator } =
  FavoriteEducatorSlice.actions;

export const handleAddFavoriteEduactor = (
  isFavoriteEducator: boolean,
  idEducator: number,
  nameEducator: string,
  dispatch: Function
) => {
  if (isFavoriteEducator) {
    Alert.alert(
      "Подтверждение удаления",
      "Вы точно хотите удалить преподавателя из избранного?",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Удалить",
          onPress: () => {
            dispatch(removeFavoriteEducator(idEducator)),
              removeFavoriteEducatorSchedule(idEducator);
          },
        },
      ]
    );
  } else {
    const newEducator: IFavoriteEducator = {
      idEducator: idEducator,
      nameEducator: nameEducator,
    };
    setFavoriteEducatorStorage(newEducator, dispatch);
  }
};

export const setFavoriteEducatorStorage = async (
  newEducator: IFavoriteEducator,
  dispatch: Function
) => {
  try {
    const storedEducator = await AsyncStorage.getItem(STORAGE_KEY_EDUCATOR);
    const educator = storedEducator ? JSON.parse(storedEducator) : [];
    if (educator.length < 15) {
      educator.push(newEducator);
      await AsyncStorage.setItem(
        STORAGE_KEY_EDUCATOR,
        JSON.stringify(educator)
      );
      dispatch(setFavoriteEducator(educator));
      Alert.alert("Преподаватель добавлен в избранное");
    } else {
      Alert.alert(
        "Ошибка",
        "Превышено максимальное число избранных преподавателей"
      );
    }
  } catch (error) {
    console.error("Ошибка сохранения преподавателя", error);
  }
};

export const removeFavoriteEducatorStorage = async (idEducator: number) => {
  try {
    const storedEducators = await AsyncStorage.getItem(STORAGE_KEY_EDUCATOR);

    if (storedEducators) {
      const educator: IFavoriteEducator[] = JSON.parse(storedEducators);
      const updatedEducator = educator.filter(
        (educator) => educator.idEducator !== idEducator
      );
      await AsyncStorage.setItem(
        STORAGE_KEY_EDUCATOR,
        JSON.stringify(updatedEducator)
      );
    }
  } catch (error) {
    console.error("Ошибка сохранения избранных групп", error);
  }
};

export default FavoriteEducatorSlice.reducer;
