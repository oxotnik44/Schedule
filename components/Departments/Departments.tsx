import React, { useCallback } from "react";
import { FlatList, Dimensions, Text, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectNameDepartments,
  setNumberDepartment,
  setTextSearchGroup,
} from "../../redux/reducers/departmentsInfoReducer";
import {
  setExtramuralGroupOpen,
  setIdDepartments,
  setLoadedExtramuralists,
  setLoadedResidents,
  setNameGroup,
  setResidentGroupOpen,
} from "../../redux/reducers/groupsInfoReducer";
import { getIsActive, getSchedule } from "../../api/apiSchedule";
import { RootStackParamList } from "../../Navigate";
import AddFavoriteGroups from "../Hoc/AddFavorite/AddFavorite";
import ImageDepartmens from "../Hoc/ImageDepartmens/ImageDepartmens";
import {
  Container,
  ContainerDepartments,
  ContainerSearchGroups,
  NameDepartments,
  NoConnected,
  SearchContainer,
  SearchImage,
  SearchInput,
} from "./DepartmentsStyle";
import { ThemeProvider } from "styled-components/native";
import {
  setIsExtramuralScheduleUntilTodayStudent,
  setSelectIdGroup,
} from "../../redux/reducers/scheduleStudentInfo";
import {
  getGroupsExtramuralists,
  getGroupsResidents,
} from "../../api/apiGroups";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
type DepartmentsProps = {
  navigation: StackNavigationProp<RootStackParamList, "Departments">;
};
interface DepartmentsState {
  departmentInfoReducer: {
    dataDepartment: [
      {
        idDepartment: number;
        nameDepartment: string;
        imgDepartment: string;
        fullnameDepartment: string;
      }
    ];
    textSearchGroup: string;

    loading: boolean; // Флаг загрузки для отображения анимации
  };
}

interface GroupsState {
  groupsInfoReducer: {
    dataGroups: [
      {
        idGroup: number;
        nameGroup: string;
      }
    ];
    selectedGroupName: string;
  };
}
type ITheme = {
  settingsReducer: {
    theme: any;
  };
};
interface Settings {
  settingsReducer: {
    isConnected: boolean;
  };
}
const Departments: React.FC<DepartmentsProps> = ({ navigation }) => {
  const { dataDepartment, textSearchGroup } = useSelector(
    (state: DepartmentsState) => state.departmentInfoReducer
  );
  const dataGroups = useSelector(
    (state: GroupsState) => state.groupsInfoReducer
  );
  const isConnected = useSelector(
    (state: Settings) => state.settingsReducer.isConnected
  );
  const theme = useSelector((state: ITheme) => state.settingsReducer.theme);

  const dispatch = useDispatch();
  const filteredData = dataGroups.dataGroups.filter((item: any) => {
    const groupsName = item.nameGroup.toLocaleLowerCase();
    const groupsValue = textSearchGroup.toLocaleLowerCase();
    return groupsName.includes(groupsValue);
  });
  const fetchSchedule = useCallback(
    async (idGroup: number, nameGroup: string) => {
      try {
        await getSchedule(idGroup, dispatch, nameGroup);
        await getIsActive(dispatch, idGroup);
      } catch (error) {
        console.log(error);
      }
    },
    [dispatch]
  );
  const fetchGroupResidents = async (numberDepartment: number) => {
    try {
      await getGroupsResidents(numberDepartment, dispatch);
      dispatch(setLoadedResidents(true));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGroupExtramuralists = async (numberDepartment: number) => {
    try {
      await getGroupsExtramuralists(numberDepartment, dispatch);
      dispatch(setLoadedExtramuralists(true));
    } catch (error) {
      console.log(error);
    }
  };
  const fetchGroups = (idDepartment: number) => {
    dispatch(setIdDepartments(idDepartment));
    if (idDepartment === 15 || idDepartment === 16) {
      fetchGroupExtramuralists(idDepartment);
    } else {
      fetchGroupResidents(idDepartment);
      fetchGroupExtramuralists(idDepartment);
    }
  };
  const isSearchInputEmpty = textSearchGroup.trim() === "";

  const renderItemDepartment = ({ item }: { item: any }) => {
    const { idDepartment, fullnameDepartment, imgDepartment } = item;
    return (
      <ContainerDepartments
        key={idDepartment}
        onPress={async () => {
          if (idDepartment === 18) {
            await getSchedule(3430, dispatch, item.nameGroup);
            await getIsActive(dispatch, 3430);
            dispatch(setSelectIdGroup(3430));
            dispatch(setNameGroup("Технопарк"));
            dispatch(setIsExtramuralScheduleUntilTodayStudent(false));

            navigation.navigate("Schedule");
          } else {
            fetchGroups(item.idDepartment);
            dispatch(setNumberDepartment(idDepartment));
            dispatch(setSelectNameDepartments(fullnameDepartment));
            navigation.navigate("Groups");
            dispatch(setResidentGroupOpen(false));
            dispatch(setExtramuralGroupOpen(false));
          }
        }}
      >
        <NameDepartments>{fullnameDepartment}</NameDepartments>
        <ImageDepartmens imgDepartment={imgDepartment} />
      </ContainerDepartments>
    );
  };

  const renderItemGroup = ({ item }: { item: any }) => {
    const { idGroup, nameGroup } = item;

    return (
      <ContainerDepartments
        key={idGroup.toString()}
        onPress={() => {
          fetchSchedule(idGroup, nameGroup).then(() => {
            navigation.navigate("Schedule");
            dispatch(setNameGroup(nameGroup));
            dispatch(setIsExtramuralScheduleUntilTodayStudent(false));
            dispatch(setSelectIdGroup(idGroup));
          });
        }}
      >
        <NameDepartments>{nameGroup}</NameDepartments>
        <AddFavoriteGroups
          idGroup={idGroup}
          nameGroup={nameGroup}
          idEducator={null}
          nameEducator={null}
        />
      </ContainerDepartments>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        {!isConnected ? (
          <NoConnected>Нет соединения с интернетом</NoConnected>
        ) : (
          <View>
            <ContainerSearchGroups>
              <SearchContainer>
                <SearchInput
                  value={textSearchGroup}
                  onChangeText={(value) => dispatch(setTextSearchGroup(value))}
                  placeholder="Поиск группы"
                  placeholderTextColor={theme.textSearchColor}
                  style={{
                    fontFamily: "Montserrat-Bold",
                    fontSize: screenWidth * 0.04,
                  }}
                />

                <SearchImage
                  source={require("../../assets/Loup.png")}
                  resizeMode="contain"
                />
              </SearchContainer>
            </ContainerSearchGroups>

            {isSearchInputEmpty ? (
              <FlatList
                data={dataDepartment}
                keyExtractor={(item) => item.idDepartment.toString()}
                renderItem={renderItemDepartment}
                showsHorizontalScrollIndicator={false}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={15}
                contentContainerStyle={{
                  paddingBottom: screenHeight * 0.02,
                }}
              />
            ) : (
              <FlatList
                data={filteredData}
                keyExtractor={(item, index) =>
                  `${item.idGroup}-${index.toString()}`
                }
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={15}
                renderItem={renderItemGroup}
                showsHorizontalScrollIndicator={false} // Удаление полоски прокрутки
              />
            )}
          </View>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default Departments;
