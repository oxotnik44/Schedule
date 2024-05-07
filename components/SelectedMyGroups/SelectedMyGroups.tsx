import React, { useCallback, useState } from "react";
import { TouchableOpacity, Alert, FlatList, ToastAndroid } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { StackNavigationProp } from "@react-navigation/stack";
import { getSchedule, getScheduleEducator } from "../../api/apiSchedule";
import { setNameGroup } from "../../redux/slices/GroupsInfoSlice";
import { setNameEducator } from "../../redux/slices/EducatorSlice";

import { ThemeProvider } from "styled-components/native";
import {
  CenteredContainer,
  Container,
  ContainerGroup,
  GroupText,
  IconContainer,
  IconDelete,
  TextNoFavorites,
  ToggleButton,
  ToggleButtonText,
  ToggleContainer,
} from "./SelectedMyGroupsStyle";
import { lightTheme } from "../../redux/slices/SettingsSlice";
import {
  setDataScheduleStudent,
  setIsExtramuralScheduleUntilTodayStudent,
  setSelectIdGroup,
} from "../../redux/slices/ScheduleStudentInfoSlice";
import {
  setDataScheduleEducator,
  setIsFullScheduleEducator,
  setSelectIdEducator,
} from "../../redux/slices/ScheduleEducatorInfoSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { removeFavoriteStudentSchedule } from "../../redux/slices/FavoritesSlice/FavoriteScheduleStudent";
import { removeFavoriteEducatorSchedule } from "../../redux/slices/FavoritesSlice/FavoriteScheduleEducator";
import { removeFavoriteGroup } from "../../redux/slices/FavoritesSlice/FavoriteGroupsSlice";
import { removeFavoriteEducator } from "../../redux/slices/FavoritesSlice/FavoriteEducatorsSlice";

type RootStackParamList = {
  Schedule: undefined;
  ScheduleEducator: undefined;
};

interface IFavoriteGroup {
  FavoriteGroupsSlice: {
    favoriteGroups: Array<{
      idGroup: number;
      nameGroup: string;
    }>;
  };
  FavoriteEducatorsSlice: {
    favoriteEducators: Array<{
      idEducator: number;
      nameEducator: string;
    }>;
  };
}

type ITheme = {
  SettingsSlice: {
    theme: any;
  };
};
type SchuduleProps = {
  navigation: StackNavigationProp<
    RootStackParamList,
    "Schedule",
    "ScheduleEducator"
  >;
};

interface Settings {
  SettingsSlice: {
    isConnected: boolean;
  };
}
const SelectedMyGroups = ({ navigation }: SchuduleProps) => {
  const [currentState, setCurrentState] = useState<"groups" | "educators">(
    "groups"
  );
  const isConnected = useSelector(
    (state: Settings) => state.SettingsSlice.isConnected
  );
  const dispatch = useDispatch();
  const theme = useSelector((state: ITheme) => state.SettingsSlice.theme);
  const favoritesGroup = useSelector(
    (state: IFavoriteGroup) => state.FavoriteGroupsSlice.favoriteGroups
  );
  const favoritesEducator = useSelector(
    (state: IFavoriteGroup) => state.FavoriteEducatorsSlice.favoriteEducators
  );
  const removeGroup = useCallback(
    (idGroupToRemove: number) => {
      Alert.alert(
        "Подтверждение удаления",
        "Вы точно хотите удалить группу из избранных?",
        [
          {
            text: "Отмена",
            style: "cancel",
          },
          {
            text: "Удалить",
            onPress: () => {
              removeFavoriteStudentSchedule(idGroupToRemove);
              dispatch(removeFavoriteGroup(idGroupToRemove));
            },
          },
        ]
      );
    },
    [dispatch]
  );
  const removeEducator = useCallback(
    (idEducatorToRemove: number) => {
      Alert.alert(
        "Подтверждение удаления",
        "Вы точно хотите удалить преподавателя из избранного?",
        [
          {
            text: "Отмена",
            style: "cancel",
          },
          {
            text: "Удалить",
            onPress: () => {
              removeFavoriteEducatorSchedule(idEducatorToRemove);
              dispatch(removeFavoriteEducator(idEducatorToRemove));
            },
          },
        ]
      );
    },
    [dispatch]
  );

  const fetchSchedule = async (idGroup: number, nameGroup: string) => {
    try {
      await getSchedule(idGroup, dispatch, nameGroup, false);
      dispatch(setSelectIdGroup(idGroup));
    } catch (error) {
      alert("Произошла ошибка: " + error);
    }
  };
  let hasDataStudent = false; // Объявляем переменную hasDataStudent за пределами функции
  let hasDataEducator = false; // Объявляем переменную hasDataStudent за пределами функции

  const fetchNoConnectedGroup = async (
    idGroup: number,
    hasDataStudent: boolean
  ) => {
    const storedScheduleStudent = await AsyncStorage.getItem(
      "favoriteSchedule"
    );
    const scheduleStudent = storedScheduleStudent
      ? JSON.parse(storedScheduleStudent)
      : { groups: [], educators: [] };
    scheduleStudent.groups.forEach((item: any) => {
      const keys = Object.keys(item);
      if (keys.includes(idGroup.toString())) {
        hasDataStudent = true;
        dispatch(setDataScheduleStudent(item[idGroup.toString()]));
      }
    });
    return hasDataStudent; // Возвращаем hasDataStudent
  };
  const fetchNoConnectedEducator = async (
    idEducator: number,
    hasDataEducator: boolean
  ) => {
    const storedScheduleEducator = await AsyncStorage.getItem(
      "favoriteSchedule"
    );
    const scheduleEducator = storedScheduleEducator
      ? JSON.parse(storedScheduleEducator)
      : { groups: [], educators: [] };
    scheduleEducator.educators.forEach((item: any) => {
      const keys = Object.keys(item);
      if (keys.includes(idEducator.toString())) {
        hasDataEducator = true;
        dispatch(setDataScheduleEducator(item[idEducator.toString()]));
      }
    });
    return hasDataEducator; // Возвращаем hasDataStudent
  };
  const renderGroupItem = useCallback(
    ({ item }: { item: { idGroup: number; nameGroup: string } }) => (
      <TouchableOpacity
        onPress={() => {
          if (!isConnected) {
            fetchNoConnectedGroup(item.idGroup, hasDataStudent).then(
              (hasDataStudent) => {
                if (!hasDataStudent) {
                  ToastAndroid.show(
                    "Нет сохранённого расписания",
                    ToastAndroid.SHORT
                  );
                } else {
                  dispatch(setNameGroup(item.nameGroup));
                  dispatch(setIsExtramuralScheduleUntilTodayStudent(false));
                  dispatch(setSelectIdGroup(item.idGroup));
                  navigation.navigate("Schedule");
                }
              }
            );
          } else {
            fetchSchedule(item.idGroup, item.nameGroup).then(() => {
              dispatch(setNameGroup(item.nameGroup));
              dispatch(setIsExtramuralScheduleUntilTodayStudent(false));
              dispatch(setSelectIdGroup(item.idGroup));
              navigation.navigate("Schedule");
            });
          }
        }}
      >
        <ContainerGroup>
          <GroupText numberOfLines={1} ellipsizeMode="tail">
            {item.nameGroup}
          </GroupText>
          <IconContainer onPress={() => removeGroup(item.idGroup)}>
            <IconDelete
              source={require("../../assets/Delete.png")}
              style={{ resizeMode: "contain" }}
            />
          </IconContainer>
        </ContainerGroup>
      </TouchableOpacity>
    ),
    [dispatch, fetchSchedule, navigation, removeGroup]
  );

  const renderEducatorItem = useCallback(
    ({ item }: { item: { idEducator: number; nameEducator: string } }) => (
      <TouchableOpacity
        style={{ flexDirection: "row" }}
        onPress={async () => {
          if (!isConnected) {
            fetchNoConnectedEducator(item.idEducator, hasDataEducator).then(
              (hasDataEducator) => {
                if (!hasDataEducator) {
                  ToastAndroid.show(
                    "Нет сохранённого расписания",
                    ToastAndroid.SHORT
                  );
                } else {
                  dispatch(setSelectIdEducator(item.idEducator));
                  dispatch(setNameEducator(item.nameEducator));
                  dispatch(setIsFullScheduleEducator(false));
                  navigation.navigate("ScheduleEducator"); // Добавляем переход
                }
              }
            );
          } else {
            await getScheduleEducator(dispatch, item.idEducator);
            dispatch(setSelectIdEducator(item.idEducator));
            dispatch(setNameEducator(item.nameEducator));

            navigation.navigate("ScheduleEducator"); // Добавляем переход
          }
        }}
      >
        <ContainerGroup>
          <GroupText>{item.nameEducator}</GroupText>
          <IconContainer onPress={() => removeEducator(item.idEducator)}>
            <IconDelete source={require("../../assets/Delete.png")} />
          </IconContainer>
        </ContainerGroup>
      </TouchableOpacity>
    ),
    [removeEducator]
  );
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <ToggleContainer>
          <ToggleButton onPress={() => setCurrentState("groups")}>
            <ToggleButtonText
              currentState={
                theme === lightTheme
                  ? currentState === "groups"
                    ? "#FFFFFF"
                    : "#FFFFFFB2"
                  : currentState === "groups"
                  ? "#004C6F"
                  : "#004C6FB2"
              }
            >
              Группы
            </ToggleButtonText>
          </ToggleButton>
          <ToggleButton onPress={() => setCurrentState("educators")}>
            <ToggleButtonText
              currentState={
                theme === lightTheme
                  ? currentState === "educators"
                    ? "#FFFFFF"
                    : "#FFFFFFB2"
                  : currentState === "educators"
                  ? "#004C6F"
                  : "#004C6FB2"
              }
            >
              Преподаватели
            </ToggleButtonText>
          </ToggleButton>
        </ToggleContainer>

        {currentState === "groups" &&
          (favoritesGroup.length !== 0 ? (
            <FlatList
              data={favoritesGroup}
              keyExtractor={(item) => `${item.idGroup}`}
              renderItem={renderGroupItem}
            />
          ) : (
            <CenteredContainer>
              <TextNoFavorites>Избранных групп нет</TextNoFavorites>
            </CenteredContainer>
          ))}

        {currentState === "educators" &&
          (favoritesEducator.length !== 0 ? (
            <FlatList
              data={favoritesEducator}
              keyExtractor={(item) => `${item.idEducator}`}
              renderItem={renderEducatorItem}
            />
          ) : (
            <CenteredContainer>
              <TextNoFavorites>Избранных преподавателей нет</TextNoFavorites>
            </CenteredContainer>
          ))}
      </Container>
    </ThemeProvider>
  );
};

export default SelectedMyGroups;
