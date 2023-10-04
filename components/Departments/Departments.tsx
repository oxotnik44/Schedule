import React, { useCallback } from "react";
import { FlatList, Dimensions } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectNameDepartments,
  setNumberDepartment,
  setTextSearchGroup,
} from "../../redux/reducers/departmentsInfoReducer";
import {
  setExtramuralGroupOpen,
  setNameGroup,
  setResidentGroupOpen,
} from "../../redux/reducers/groupsInfoReducer";
import { getSchedule } from "../../api/apiSchedule";
import { RootStackParamList } from "../../Navigate";
import AddFavoriteGroups from "../Hoc/AddFavorite/AddFavorite";
import ImageDepartmens from "../Hoc/ImageDepartmens/ImageDepartmens";
import {
  Container,
  ContainerDepartments,
  ContainerSearchGroups,
  NameDepartments,
  SearchContainer,
  SearchImage,
  SearchInput,
} from "./DepartmentsStyle";
import { ThemeProvider } from "styled-components/native";
import {
  setIsFullScheduleStudent,
  setSelectIdGroup,
} from "../../redux/reducers/scheduleStudentInfo";

const screenWidth = Dimensions.get("window").width;
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
const Departments: React.FC<DepartmentsProps> = ({ navigation }) => {
  const { dataDepartment, textSearchGroup } = useSelector(
    (state: DepartmentsState) => state.departmentInfoReducer
  );
  const dataGroups = useSelector(
    (state: GroupsState) => state.groupsInfoReducer
  );
  const theme = useSelector((state: ITheme) => state.settingsReducer.theme);

  const dispatch = useDispatch();
  const filteredData = dataGroups.dataGroups.filter((item: any) => {
    const groupsName = item.nameGroup.toLocaleLowerCase();
    const groupsValue = textSearchGroup.toLocaleLowerCase();
    return groupsName.includes(groupsValue);
  });
  const fetchSchedule = useCallback(
    async (idGroup: number) => {
      try {
        await getSchedule(idGroup, dispatch);
      } catch (error) {
        console.log(error);
      }
    },
    [dispatch]
  );

  const isSearchInputEmpty = textSearchGroup.trim() === "";

  const renderItemDepartment = ({ item }: { item: any }) => {
    const { idDepartment, fullnameDepartment, imgDepartment } = item;
    return (
      <ContainerDepartments
        key={idDepartment}
        onPress={() => {
          dispatch(setNumberDepartment(idDepartment));
          dispatch(setSelectNameDepartments(fullnameDepartment));
          navigation.navigate("Groups");
          dispatch(setResidentGroupOpen(false));
          dispatch(setExtramuralGroupOpen(false));
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
          fetchSchedule(idGroup).then(() => {
            navigation.navigate("Schedule");
            dispatch(setNameGroup(nameGroup));
            dispatch(setIsFullScheduleStudent(false));
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
            showsHorizontalScrollIndicator={false} // Удаление полоски прокрутки
          />
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item, index) =>
              `${item.idGroup}-${index.toString()}`
            }
            renderItem={renderItemGroup}
            showsHorizontalScrollIndicator={false} // Удаление полоски прокрутки
          />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default Departments;