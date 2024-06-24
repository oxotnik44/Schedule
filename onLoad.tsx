import React, { useEffect, useState } from "react";
import Navigate, { RootStackParamList } from "./Navigate";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

import { getDepartments } from "./api/apiDepartments";
import { getEducator } from "./api/apiEducator";
import { getNews } from "./api/apiNews";
import { getGroups } from "./api/apiGroups";
import { useFonts } from "expo-font";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAppDispatch } from "./redux/store";
import { setConnectionStatus, setTheme } from "./redux/slices/SettingsSlice";
import { setFavoriteGroups } from "./redux/slices/FavoritesSlice/FavoriteGroupsSlice";
import { setFavoriteEducator } from "./redux/slices/FavoritesSlice/FavoriteEducatorsSlice";
import { setTokenUser } from "./redux/slices/AccountSlices/AuthTokenSlice";
import { AuthOnLoad } from "./api/apiAuthentication";
import { setProfileInfo } from "./redux/slices/AccountSlices/ProfileInfoSlice";
import { getCreditBookStudent } from "./api/apiUserStudent";

type GroupsProps = {
  navigation: StackNavigationProp<RootStackParamList, "Settings">;
};

const Load = ({ navigation }: GroupsProps) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [fontsLoaded] = useFonts({
    "Montserrat-SemiBold": require("./assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Bold": require("./assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-Regular": require("./assets/fonts/Montserrat-Regular.ttf"),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получение и установка выбранной темы приложения
        const storedTheme = await AsyncStorage.getItem("selectedTheme");
        if (storedTheme) {
          dispatch(setTheme(storedTheme));
        }

        // Получение токена и персональных данных студента из хранилища
        const accessToken = JSON.parse(
          (await AsyncStorage.getItem("authTokenStorage")) || "null"
        );
        const personalDataStudent = accessToken
          ? JSON.parse(
              (await AsyncStorage.getItem("profileStudentInfoStorage")) ||
                "null"
            )
          : null;
        // Установка токена пользователя и авторизация, если есть токен и данные студента
        dispatch(setTokenUser(accessToken));
        if (accessToken && personalDataStudent) {
          await AuthOnLoad(accessToken, dispatch, personalDataStudent);
        }

        // Получение и установка избранных групп и преподавателей
        const getStoredItems = async (key: string) => {
          const storedData = await AsyncStorage.getItem(key);
          return storedData ? JSON.parse(storedData) : [];
        };
        const storedGroups = await getStoredItems("favoriteGroups");
        const storedEducator = await getStoredItems("favoriteEducators");
        dispatch(setFavoriteGroups(storedGroups));
        dispatch(setFavoriteEducator(storedEducator));

        // Функция для запроса данных и обработки ошибок
        const fetchPrimaryData = async (fetchFunction: Function) => {
          try {
            await fetchFunction(dispatch);
          } catch (error) {
            console.error("Error during fetching data:", error);
            alert("Произошла ошибка при получении данных.");
          }
        };

        // Запрос основных данных: преподавателей, департаментов, новостей, групп
        const fetchFunctions = [
          getDepartments,
          getEducator,
          getNews,
          getGroups,
        ];
        const isConnected = (await NetInfo.fetch()).isConnected;
        dispatch(setConnectionStatus(isConnected));
        if (isConnected) {
          await Promise.all(fetchFunctions.map(fetchPrimaryData));
        }
      } catch (error) {
        console.error("Error during loading:", error);
      } finally {
        // Завершение загрузки
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return loading ? <></> : <Navigate navigation={navigation} />;
};

export default Load;
