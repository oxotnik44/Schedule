import React, { useEffect } from "react";
import { View, Dimensions, ToastAndroid, FlatList } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  setLoadedResidents,
  setLoadedExtramuralists,
  setResidentGroupOpen,
  setExtramuralGroupOpen,
  setNameGroup,
} from "../../redux/slices/GroupsInfoSlice";
import { RootStackParamList } from "../../Navigate";
import {
  getGroupsResidents,
  getGroupsExtramuralists,
} from "../../api/apiGroups";
import { getSchedule } from "../../api/apiSchedule";
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
} from "../../redux/slices/ScheduleStudentInfoSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import AddFavorite from "../../helper/AddFavorite/AddFavorite";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

type GroupsProps = {
  navigation: StackNavigationProp<RootStackParamList, "Groups">;
};
interface GroupsState {
  GroupsInfoSlice: {
    selectedGroupNumber: number;
    dataGroupsResidents: [
      {
        idGroup: number;
        nameGroup: string;
        isResidentAspirant: number;
      }
    ];
    dataGroupsExtramuralists: [
      {
        idGroup: number;
        nameGroup: string;
        isResidentAspirant: number;
      }
    ];
    loadedResidents: boolean;
    loadedExtramuralists: boolean;
    isResidentGroupOpen: boolean;
    isExtramuralGroupOpen: boolean;
    idDepartments: number;
  };
}
interface DepartmentNumberState {
  DepartmentInfoSlice: {
    numberDepartment: number;
  };
}

interface Settings {
  SettingsSlice: {
    isConnected: boolean;
  };
}
const Groups = ({ navigation }: GroupsProps) => {
  const numberDepartment = useAppSelector(
    (state) => state.DepartmentInfoSlice.numberDepartment
  );

  const dataGroups = useAppSelector((state) => state.GroupsInfoSlice);

  const isConnected = useAppSelector(
    (state) => state.SettingsSlice.isConnected
  );

  const dispatch = useAppDispatch();
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
      await getSchedule(idGroup, dispatch, nameGroup, false);
    } catch (error) {
      alert("Произошла ошибка");
    }
  };
  const handleGroupToggle = (isResidentGroup: boolean) => {
    if (isResidentGroup) {
      dispatch(setResidentGroupOpen(!dataGroups.isResidentGroupOpen));
      dispatch(setExtramuralGroupOpen(false));
    } else {
      dispatch(setExtramuralGroupOpen(!dataGroups.isExtramuralGroupOpen));
      dispatch(setResidentGroupOpen(false));
    }
  };
  let hasData = false; // Объявляем переменную hasData за пределами функции

  const fetchNoConnected = async (idGroup: number) => {
    console.log(idGroup);
    const storedSchedule = await AsyncStorage.getItem("favoriteSchedule");
    const scheduleStudent = storedSchedule
      ? JSON.parse(storedSchedule)
      : { groups: [], educators: [] };

    const foundGroup = scheduleStudent.groups.find((item: any) => {
      const keys = Object.keys(item);
      return keys.includes(idGroup.toString());
    });

    if (foundGroup) {
      dispatch(setDataScheduleStudent(foundGroup[idGroup.toString()]));
      return true;
    }

    return false;
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
        <FlatList
          data={
            dataGroups.idDepartments === 15 || dataGroups.idDepartments === 16
              ? dataGroups.dataGroupsExtramuralists.filter(
                  (group: any) => group.isResidentAspirant === 0
                )
              : dataGroups.dataGroupsResidents
          }
          keyExtractor={(group) => group.idGroup.toString()}
          initialNumToRender={6}
          maxToRenderPerBatch={10}
          windowSize={10}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: group }) => (
            <ContainerGroups
              onPress={() => {
                if (!isConnected) {
                  fetchNoConnected(group.idGroup).then((hasData) => {
                    if (!hasData) {
                      ToastAndroid.show(
                        "Нет сохранённого расписания",
                        ToastAndroid.SHORT
                      );
                    } else {
                      dispatch(setNameGroup(group.nameGroup));
                      dispatch(setIsExtramuralScheduleUntilTodayStudent(false));
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
              <AddFavorite
                idGroup={group.idGroup}
                nameGroup={group.nameGroup}
                idEducator={null}
                nameEducator={null}
              />
            </ContainerGroups>
          )}
        />
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
            data={
              dataGroups.idDepartments === 15 || dataGroups.idDepartments === 16
                ? dataGroups.dataGroupsExtramuralists.filter(
                    (group: any) => group.isResidentAspirant === 1
                  )
                : dataGroups.dataGroupsExtramuralists
            }
            keyExtractor={(group) => group.idGroup.toString()}
            initialNumToRender={6}
            maxToRenderPerBatch={10}
            windowSize={10}
            showsVerticalScrollIndicator={false}
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
                    console.log(group.idGroup, group.nameGroup);
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
                <NameGroup numberOfLines={2}>{group.nameGroup}</NameGroup>
                <View>
                  <AddFavorite
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
