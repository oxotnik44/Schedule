import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
  FlatList,
  Pressable,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { StackNavigationProp } from "@react-navigation/stack";
import { getSchedule, getScheduleEducator } from "../../api/apiSchedule";
import { setNameGroup } from "../../redux/reducers/groupsInfoReducer";
import { removeFavoriteGroupAC } from "../../redux/reducers/favoritesReducer/favoriteGroupsReducer";
import { removeFavoriteEducatorAC } from "../../redux/reducers/favoritesReducer/favoriteEducatorsReducer";
import { setNameEducator } from "../../redux/reducers/educatorReducer";

import styled, { ThemeProvider } from "styled-components/native";
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
import {
  darkTheme,
  lightTheme,
  setTheme,
} from "../../redux/reducers/settingsReducer";
import { setIsFullScheduleStudent, setSelectIdGroup } from "../../redux/reducers/scheduleStudentInfo";
import { setIsFullScheduleEducator, setSelectIdEducator } from "../../redux/reducers/scheduleEducatorInfo";


type RootStackParamList = {
  Schedule: undefined;
  ScheduleEducator: undefined;
};

interface IFavoriteGroup {
  favoriteGroupReducer: {
    favoriteGroups: Array<{
      idGroup: number;
      nameGroup: string;
    }>;
  };
  favoriteEducatorReducer: {
    favoriteEducators: Array<{
      idEducator: number;
      nameEducator: string;
    }>;
  };
}

type ITheme = {
  settingsReducer: {
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
interface ContainerProps {
  currentState: "groups" | "educators"; // Замените 'other' на другие варианты, если нужно
}

const SelectedMyGroups = ({ navigation }: SchuduleProps) => {
  const [currentState, setCurrentState] = useState<"groups" | "educators">(
    "groups"
  );
  const dispatch = useDispatch();
  const theme = useSelector((state: ITheme) => state.settingsReducer.theme);
  const favoritesGroup = useSelector(
    (state: IFavoriteGroup) => state.favoriteGroupReducer.favoriteGroups
  );
  const favoritesEducator = useSelector(
    (state: IFavoriteGroup) => state.favoriteEducatorReducer.favoriteEducators
  );
  const removeGroup = useCallback(
    (idGroupToRemove: number) => {
      Alert.alert(
        "Подтверждение удаления",
        "Вы точно хотите удалить из избранных?",
        [
          {
            text: "Отмена",
            style: "cancel",
          },
          {
            text: "Удалить",
            onPress: () => {
              dispatch(removeFavoriteGroupAC(idGroupToRemove));
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
        "Вы точно хотите удалить из избранных?",
        [
          {
            text: "Отмена",
            style: "cancel",
          },
          {
            text: "Удалить",
            onPress: () => {
              dispatch(removeFavoriteEducatorAC(idEducatorToRemove));
            },
          },
        ]
      );
    },
    [dispatch]
  );

  const fetchSchedule = async (idGroup: number) => {
    try {
      await getSchedule(idGroup, dispatch);
      dispatch(setSelectIdGroup(idGroup));
    } catch (error) {
      alert("Произошла ошибка: " + error);
    }
  };
  const renderGroupItem = useCallback(
    ({ item }: { item: { idGroup: number; nameGroup: string } }) => (
      <TouchableOpacity
        onPress={() => {
          fetchSchedule(item.idGroup).then(() => {
            dispatch(setNameGroup(item.nameGroup));
            dispatch(setIsFullScheduleStudent(false));
            navigation.navigate("Schedule");
          });
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
          await getScheduleEducator(dispatch, item.idEducator);
          dispatch(setNameEducator(item.nameEducator));
          dispatch(setSelectIdEducator(item.idEducator));
          dispatch(setIsFullScheduleEducator(false));
          navigation.navigate("ScheduleEducator"); // Добавляем переход
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