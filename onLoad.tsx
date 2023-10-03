import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./redux/store";
import React, { useEffect, useState } from "react";
import Navigate from "./Navigate";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getDepartments } from "./api/apiDepartments";
import { getSchedule } from "./api/apiSchedule";
import { getEducator } from "./api/apiEducator";
import { getNews } from "./api/apiNews";
import { getGroups } from "./api/apiGroups";
import { setFavoriteGroupsAC } from "./redux/reducers/favoritesReducer/favoriteGroupsReducer";
import { setFavoriteEducatorAC } from "./redux/reducers/favoritesReducer/favoriteEducatorsReducer";
import { useFonts } from "expo-font";
import { setTheme } from "./redux/reducers/settingsReducer";

const Load = () => {
  const dispatch = useDispatch();
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
      dispatch(setFavoriteGroupsAC(groups));
    };

    const getFavoritesEducators = async (): Promise<void> => {
      const storedEducator = await AsyncStorage.getItem("favoriteEducators");
      const educator: { idEducator: number; nameEducator: string }[] =
        storedEducator ? JSON.parse(storedEducator) : [];
      dispatch(setFavoriteEducatorAC(educator));
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
    // const fetchScheduleIfNeeded = async (): Promise<void> => {
    //   const storedGroups = await AsyncStorage.getItem("favoriteGroups");
    //   if (storedGroups) {
    //     const parsedGroups: { idGroup: number; nameGroup: string }[] =
    //       JSON.parse(storedGroups);
    //     const idGroup = parsedGroups[0]?.idGroup;
    //     if (idGroup) {
    //       try {
    //         await getSchedule(idGroup, dispatch);
    //       } catch (error) {
    //         // Обработка ошибки
    //         alert("Произошла ошибка: ");
    //         // Дополнительные действия по обработке ошибки
    //       }
    //     }
    //   }
    // };

    const onLoad = async (): Promise<void> => {
      if (loading) {
        await getTheme()
        await fetchDepartments();
        await getFavoritesGroups();
        await getFavoritesEducators();
        // await fetchScheduleIfNeeded();
        await fetchEducator();
        await News();
        await Groups();
        setLoading(false);
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
    return <Navigate />;
  }
};

export default Load;
