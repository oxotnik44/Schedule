import { Reducer } from "redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { removeFavoriteEducatorSchedule } from "./favoriteScheduleEducator";

const STORAGE_KEY_EDUCATOR = "favoriteEducators";

const SET_FAVORITE_EDUCATOR = "SET_FAVORITE_EDUCATOR";
const REMOVE_FAVORITE_EDUCATOR = "REMOVE_FAVORITE_EDUCATOR";

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

const favoriteEducatorReducer: Reducer<IEducatorState> = (
  state = initialFavoritesState,
  action
) => {
  switch (action.type) {
    case SET_FAVORITE_EDUCATOR:
      return { ...state, favoriteEducators: action.favoriteEducator };
    case REMOVE_FAVORITE_EDUCATOR:
      const updatedEducator = state.favoriteEducators.filter(
        (educator: any) => educator.idEducator !== action.idEducator
      );
      removeFavoriteEducator(action.idEducator);
      return { ...state, favoriteEducators: updatedEducator };
    default:
      return state;
  }
};
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
            dispatch(removeFavoriteEducatorAC(idEducator)),
              removeFavoriteEducatorSchedule(idEducator);
          },
        },
      ]
    );
  } else {
    const newEducator = {
      idEducator: idEducator,
      nameEducator: nameEducator,
    };
    setFavoriteEducator(newEducator, dispatch);
  }
};
export const setFavoriteEducator = async (
  newEducator: IFavoriteEducator,
  dispatch: Function
) => {
  try {
    const storedEducator = await AsyncStorage.getItem(STORAGE_KEY_EDUCATOR);
    const educator = storedEducator ? JSON.parse(storedEducator) : [];
    if (educator.length < 5) {
      educator.push(newEducator);
      await AsyncStorage.setItem(
        STORAGE_KEY_EDUCATOR,
        JSON.stringify(educator)
      );
      dispatch(setFavoriteEducatorAC(educator));
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
const removeFavoriteEducator = async (idEducator: number) => {
  try {
    const storedEducators = await AsyncStorage.getItem(STORAGE_KEY_EDUCATOR);

    if (storedEducators) {
      const educator: IFavoriteEducator[] = JSON.parse(storedEducators);
      const updatedEducator = educator.filter(
        (educator: any) => educator.idEducator !== idEducator
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
export const setFavoriteEducatorAC = (
  favoriteEducator: IFavoriteEducator[]
) => ({
  type: SET_FAVORITE_EDUCATOR,
  favoriteEducator,
});
export const removeFavoriteEducatorAC = (idEducator: number) => ({
  type: REMOVE_FAVORITE_EDUCATOR,
  idEducator,
});

export default favoriteEducatorReducer;
