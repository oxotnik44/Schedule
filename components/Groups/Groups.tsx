import React, { useEffect } from "react";
import { View, ScrollView, Dimensions } from "react-native";
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
import { setIsFullScheduleStudent, setSelectIdGroup, setTypeGroupStudent } from "../../redux/reducers/scheduleStudentInfo";

const screenWidth = Dimensions.get("window").width;

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
interface FavoriteGroupsState {
  favoriteGroupReducer: {
    favoriteGroups: { idGroup: number; nameGroup: string }[];
  };
}
interface ArrowIconProps {
  isRotate: boolean;
}

const Groups = ({ navigation }: GroupsProps) => {
  const favoriteGroups = useSelector(
    (state: FavoriteGroupsState) => state.favoriteGroupReducer.favoriteGroups
  );
  const numberDepartment = useSelector(
    (state: DepartmentNumberState) =>
      state.departmentInfoReducer.numberDepartment
  );
  const { selectedGroupNumber } = useSelector(
    (state: GroupsState) => state.groupsInfoReducer
  );
  const dataGroups = useSelector(
    (state: GroupsState) => state.groupsInfoReducer
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

  const fetchSchedule = async (idGroup: number) => {
    try {
      await getSchedule(idGroup, dispatch);
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
  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ContainerChoiceGroup onPress={() => handleGroupToggle(true)}>
          <TextChoiceGroups>Очные группы</TextChoiceGroups>
          <ArrowIcon
            source={require("../../assets/ArrowBack.png")}
            isRotate={dataGroups.isResidentGroupOpen}
          />
        </ContainerChoiceGroup>

        {dataGroups.isResidentGroupOpen && (
          <View>
            {dataGroups.dataGroupsResidents.map((group: any) => (
              <ContainerGroups
                key={group.idGroup}
                onPress={() => {
                  fetchSchedule(group.idGroup).then(() => {
                    dispatch(setNameGroup(group.nameGroup));
                    dispatch(setIsFullScheduleStudent(false));
                    dispatch(setSelectIdGroup(group.idGroup));
                    dispatch(setTypeGroupStudent("resident"));
                    navigation.navigate("Schedule");
                  });
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
            ))}
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
            {dataGroups.dataGroupsExtramuralists.map((group: any) => (
              <ContainerGroups
                key={group.idGroup}
                onPress={() => {
                  fetchSchedule(group.idGroup).then(() => {
                    dispatch(setNameGroup(group.nameGroup));
                    dispatch(setIsFullScheduleStudent(false));
                    dispatch(setSelectIdGroup(group.idGroup));
                    dispatch(setTypeGroupStudent("extramural"));
                    navigation.navigate("Schedule");
                  });
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
            ))}
          </View>
        )}
      </ScrollView>
    </Container>
  );
};

export default Groups;
