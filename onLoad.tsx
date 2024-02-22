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
import { setTokenUser } from "./redux/slices/AuthTokenSlice";
type GroupsProps = {
  navigation: StackNavigationProp<RootStackParamList, "Settings">;
};

const Load = ({ navigation }: GroupsProps) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [fontsLoaded] = useFonts({
    "Montserrat-SemiBold": require("./assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Bold": require("./assets/fonts/Montserrat-Bold.ttf"),
  });

  useEffect(() => {
    const getFavoritesGroups = async (): Promise<void> => {
      const storedGroups = await AsyncStorage.getItem("favoriteGroups");
      const groups: { idGroup: number; nameGroup: string }[] = storedGroups
        ? JSON.parse(storedGroups)
        : [];
      dispatch(setFavoriteGroups(groups));
    };

    const getFavoritesEducators = async (): Promise<void> => {
      const storedEducator = await AsyncStorage.getItem("favoriteEducators");
      const educator: { idEducator: number; nameEducator: string }[] =
        storedEducator ? JSON.parse(storedEducator) : [];
      dispatch(setFavoriteEducator(educator));
    };
    const getAuthUserToken = async () => {
      const authTokenStorage = await AsyncStorage.getItem("authTokenStorage");
      const token = authTokenStorage ? JSON.parse(authTokenStorage) : null;
      console.log(authTokenStorage)
      if (token === null) {
        dispatch(setTokenUser(null));
      } else {
        dispatch(setTokenUser(token));
      }
    };
    const getTheme = async (): Promise<void> => {
      try {
        const storedTheme = await AsyncStorage.getItem("selectedTheme");
        if (storedTheme) {
          dispatch(setTheme(storedTheme)); // Передача объекта темы
        }
      } catch (error) {
        console.error("Error while getting theme:", error);
      }
    };

    const fetchDepartments = async (): Promise<void> => {
      try {
        await getDepartments(dispatch);
      } catch (error) {
        // Обработка ошибки
        alert("Произошла ошибка: ");
      }
    };
    const fetchEducator = async (): Promise<void> => {
      try {
        await getEducator(dispatch);
      } catch (error) {
        // Обработка ошибки
        alert("Произошла ошибка: ");
      }
    };
    const News = async (): Promise<void> => {
      try {
        await getNews(dispatch);
      } catch (e) {
        console.log(e);
      }
    };
    const Groups = async (): Promise<void> => {
      try {
        await getGroups(dispatch);
      } catch (error) {
        // Обработка ошибки
        alert("Произошла ошибка: ");
      }
    };

    const onLoad = async (): Promise<void> => {
      if (loading) {
        await getTheme();
        await getFavoritesGroups();
        await getFavoritesEducators();
        // await fetchScheduleIfNeeded();
        NetInfo.fetch().then(async (state) => {
          dispatch(setConnectionStatus(state.isConnected));
          if (state.isConnected) {
            await fetchEducator();
            await fetchDepartments();
            await News();
            await Groups();
            await getAuthUserToken();
          }
          setLoading(false);
        });
      }
    };

    onLoad();
  }, [loading]);

  if (!fontsLoaded) {
    return null;
  }

  if (loading) {
    return <></>; // Или можно отображать индикатор загрузки
  } else {
    return <Navigate navigation={navigation} />;
  }
};

export default Load;
