import React, { useEffect } from "react";
import {
  View,
  ScrollView,
  Dimensions,
  ToastAndroid,
  FlatList,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  setLoadedResidents,
  setLoadedExtramuralists,
  setResidentGroupOpen,
  setExtramuralGroupOpen,
  setNameGroup,
} from "../../redux/reducers/groupsInfoReducer";
import { RootStackParamList } from "../../Navigate";
import {
  getGroupsResidents,
  getGroupsExtramuralists,
} from "../../api/apiGroups";
import { getSchedule } from "../../api/apiSchedule";
import AddFavoriteGroups from "../Hoc/AddFavorite/AddFavorite";
import {
  ArrowIcon,
  Container,
  ContainerChoiceGroup,
  ContainerGroups,
  NameGroup,
  TextChoiceGroups,
} from "./GroupsStyle";
import {
  setDataScheduleStudent,
  setIsExtramuralScheduleUntilTodayStudent,
  setSelectIdGroup,
  setTypeGroupStudent,
} from "../../redux/reducers/scheduleStudentInfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setFavoriteSchedule } from "../../redux/reducers/favoritesReducer/favoriteScheduleStudent";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

type GroupsProps = {
  navigation: StackNavigationProp<RootStackParamList, "Groups">;
};
interface GroupsState {
  groupsInfoReducer: {
    selectedGroupNumber: number;
    dataGroupsResidents: [
      {
        idGroup: number;
        nameGroup: string;
      }
    ];
    dataGroupsExtramuralists: [
      {
        idGroup: number;
        nameGroup: string;
      }
    ];
    loadedResidents: boolean;
    loadedExtramuralists: boolean;
    isResidentGroupOpen: boolean;
    isExtramuralGroupOpen: boolean;
  };
}
interface DepartmentNumberState {
  departmentInfoReducer: {
    numberDepartment: number;
  };
}

interface Settings {
  settingsReducer: {
    isConnected: boolean;
  };
}
const Groups = ({ navigation }: GroupsProps) => {
  const numberDepartment = useSelector(
    (state: DepartmentNumberState) =>
      state.departmentInfoReducer.numberDepartment
  );

  const dataGroups = useSelector(
    (state: GroupsState) => state.groupsInfoReducer
  );

  const isConnected = useSelector(
    (state: Settings) => state.settingsReducer.isConnected
  );
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchGroupResidents = async () => {
      try {
        await getGroupsResidents(numberDepartment, dispatch);
        dispatch(setLoadedResidents(true));
      } catch (error) {
        console.log(error);
      }
    };

    const fetchGroupExtramuralists = async () => {
      try {
        await getGroupsExtramuralists(numberDepartment, dispatch);
        dispatch(setLoadedExtramuralists(true));
      } catch (error) {
        console.log(error);
      }
    };

    fetchGroupResidents();
    fetchGroupExtramuralists();
  }, [numberDepartment, dispatch]);

  const fetchSchedule = async (idGroup: number, nameGroup: string) => {
    try {
      await getSchedule(idGroup, dispatch, nameGroup);
    } catch (error) {
      alert("Произошла ошибка");
    }
  };

  const handleGroupToggle = (isResidentGroup: boolean) => {
    if (isResidentGroup) {
      dispatch(setResidentGroupOpen(!dataGroups.isResidentGroupOpen));
    } else {
      dispatch(setExtramuralGroupOpen(!dataGroups.isExtramuralGroupOpen));
    }
  };
  let hasData = false; // Объявляем переменную hasData за пределами функции

  const fetchNoConnected = async (idGroup: number, hasData: boolean) => {
    const storedSchedule = await AsyncStorage.getItem("favoriteSchedule");
    const scheduleStudent = storedSchedule
      ? JSON.parse(storedSchedule)
      : { groups: [], educators: [] };

    scheduleStudent.groups.forEach((item: any) => {
      const keys = Object.keys(item);
      if (keys.includes(idGroup.toString())) {
        hasData = true;
        dispatch(setDataScheduleStudent(item[idGroup.toString()]));
      }
    });
    return hasData; // Возвращаем hasData
  };

  return (
    <Container>
      <ContainerChoiceGroup onPress={() => handleGroupToggle(true)}>
        <TextChoiceGroups>Очные группы</TextChoiceGroups>
        <ArrowIcon
          source={require("../../assets/ArrowBack.png")}
          isRotate={dataGroups.isResidentGroupOpen}
        />
      </ContainerChoiceGroup>

      {dataGroups.isResidentGroupOpen && (
        <View>
          <FlatList
            data={dataGroups.dataGroupsResidents}
            keyExtractor={(group) => group.idGroup.toString()}
            initialNumToRender={6}
            maxToRenderPerBatch={10}
            windowSize={10}
            contentContainerStyle={{
              paddingBottom: screenHeight * 0.16,
            }}
            renderItem={({ item: group }) => (
              <ContainerGroups
                onPress={() => {
                  if (!isConnected) {
                    fetchNoConnected(group.idGroup, hasData).then((hasData) => {
                      if (!hasData) {
                        ToastAndroid.show(
                          "Нет сохранённого расписания",
                          ToastAndroid.SHORT
                        );
                      } else {
                        dispatch(setNameGroup(group.nameGroup));
                        dispatch(
                          setIsExtramuralScheduleUntilTodayStudent(false)
                        );
                        navigation.navigate("Schedule");
                      }
                    });
                  } else {
                    fetchSchedule(group.idGroup, group.nameGroup).then(() => {
                      dispatch(setNameGroup(group.nameGroup));
                      dispatch(setIsExtramuralScheduleUntilTodayStudent(false));
                      dispatch(setSelectIdGroup(group.idGroup));
                      dispatch(setTypeGroupStudent("resident"));
                      navigation.navigate("Schedule");
                    });
                  }
                }}
              >
                <NameGroup numberOfLines={2}>{group.nameGroup}</NameGroup>
                <AddFavoriteGroups
                  idGroup={group.idGroup}
                  nameGroup={group.nameGroup}
                  idEducator={null}
                  nameEducator={null}
                />
              </ContainerGroups>
            )}
          />
        </View>
      )}

      <ContainerChoiceGroup onPress={() => handleGroupToggle(false)}>
        <TextChoiceGroups>Заочные группы</TextChoiceGroups>
        <ArrowIcon
          source={require("../../assets/ArrowBack.png")}
          isRotate={dataGroups.isExtramuralGroupOpen}
        />
      </ContainerChoiceGroup>

      {dataGroups.isExtramuralGroupOpen && (
        <View>
          <FlatList
            data={dataGroups.dataGroupsExtramuralists}
            keyExtractor={(group) => group.idGroup.toString()}
            initialNumToRender={6}
            maxToRenderPerBatch={10}
            windowSize={10}
            contentContainerStyle={{
              paddingBottom: screenHeight * 0.16,
            }}
            renderItem={({ item: group }) => (
              <ContainerGroups
                onPress={() => {
                  if (!isConnected) {
                    ToastAndroid.show(
                      "Нет соединения с интернетом",
                      ToastAndroid.SHORT
                    );
                  } else {
                    fetchSchedule(group.idGroup, group.nameGroup).then(() => {
                      dispatch(setNameGroup(group.nameGroup));
                      dispatch(setIsExtramuralScheduleUntilTodayStudent(false));
                      dispatch(setSelectIdGroup(group.idGroup));
                      dispatch(setTypeGroupStudent("extramural"));
                      navigation.navigate("Schedule");
                    });
                  }
                }}
              >
                <NameGroup>{group.nameGroup}</NameGroup>
                <View>
                  <AddFavoriteGroups
                    idGroup={group.idGroup}
                    nameGroup={group.nameGroup}
                    idEducator={null}
                    nameEducator={null}
                  />
                </View>
              </ContainerGroups>
            )}
          />
        </View>
      )}
    </Container>
  );
};

export default Groups;
