import React, { useState } from "react";
import { View, FlatList, Dimensions, ToastAndroid } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";

import { RootStackParamList } from "../../Navigate";
import { setNameEducator } from "../../redux/reducers/EducatorSlice";

import {
  Container,
  ContainerEducators,
  ContainerSearchGroups,
  NameEducators,
  NoConnected,
  RegaliaEducators,
  SearchContainer,
  SearchImage,
  SearchInput,
} from "./EducatorStyle";
import { getScheduleEducator } from "../../api/apiSchedule";
import { ThemeProvider } from "styled-components/native";

import AddFavoriteGroups from "../Hoc/AddFavorite/AddFavorite";
import {
  setDataScheduleEducator,
  setIsFullScheduleEducator,
  setSelectIdEducator,
} from "../../redux/reducers/ScheduleEducatorInfoSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
const screenWidth = Dimensions.get("window").width;

type EducatorProps = {
  navigation: StackNavigationProp<RootStackParamList, "Educator">;
};

interface EducatorState {
  educatorInfoReducer: {
    dataEducator: [
      {
        idEducator: number;
        nameEducator: string;
        regaliaEducator: string;
      }
    ];
    textSearchEducator: string;
    loading: boolean; // Флаг загрузки для отображения анимации
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
const Educator: React.FC<EducatorProps> = ({ navigation }) => {
  const { dataEducator } = useSelector(
    (state: EducatorState) => state.educatorInfoReducer
  );
  const isConnected = useSelector(
    (state: Settings) => state.settingsReducer.isConnected
  );
  const [searchEducator, setSearchEducator] = useState("");
  const dispatch = useDispatch();
  const theme = useSelector((state: ITheme) => state.settingsReducer.theme);
  const filteredData = dataEducator.filter((item) => {
    const educatorName = item.nameEducator.toLocaleLowerCase();
    const educatorValue = searchEducator.toLocaleLowerCase();

    return educatorName.includes(educatorValue);
  });
  const fetchNoConnected = async (idEducator: number) => {
    console.log(idEducator)
    const storedSchedule = await AsyncStorage.getItem("favoriteSchedule");
    const scheduleEducator = storedSchedule ? JSON.parse(storedSchedule) : { groups: [], educators: [] };

    const foundEducator = scheduleEducator.educators.find((item: any) => {
      const keys = Object.keys(item);
      return keys.includes(idEducator.toString());
    });

    if (foundEducator) {
      dispatch(setDataScheduleEducator(foundEducator[idEducator.toString()]));
      return true;
    }

    return false;
  };
  const renderItemEducator = ({ item }: { item: any }) => {
    const { idEducator, nameEducator, regaliaEducator } = item;
    return (

      <ContainerEducators
        key={idEducator}
        onPress={async () => {
          if (!isConnected) {
            fetchNoConnected(idEducator).then((hasData) => {
              if (!hasData) {
                ToastAndroid.show(
                  "Нет сохранённого расписания",
                  ToastAndroid.SHORT
                );
              } else {
                dispatch(setNameEducator(nameEducator));
                dispatch(setIsFullScheduleEducator(false));
                navigation.navigate("ScheduleEducator");
              }
            });
          }
          else {
            dispatch(setNameEducator(nameEducator));
            dispatch(setIsFullScheduleEducator(false));
            dispatch(setSelectIdEducator(idEducator));
            await getScheduleEducator(dispatch, idEducator);
            navigation.navigate("ScheduleEducator");
          }

        }}
      >
        <View style={{ width: screenWidth * 0.7 }}>
          <NameEducators numberOfLines={2}>{nameEducator}</NameEducators>
          <RegaliaEducators>Учёное звание: {regaliaEducator}</RegaliaEducators>
        </View>
        <View>
          <AddFavoriteGroups
            idGroup={null}
            nameGroup={null}
            idEducator={idEducator}
            nameEducator={nameEducator}
          />
        </View>
      </ContainerEducators>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        {!isConnected && !dataEducator.length ? (
          <NoConnected>Нет соединения с интернетом</NoConnected>
        ) : (
          <View>
            <ContainerSearchGroups>
              <SearchContainer>
                <SearchInput
                  value={searchEducator}
                  onChangeText={(value) => setSearchEducator(value)}
                  placeholder="Поиск преподавателя"
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

            <FlatList
              data={filteredData}
              keyExtractor={(item) => item.idEducator.toString()}
              renderItem={renderItemEducator}
              showsHorizontalScrollIndicator={false} // Удаление полоски прокрутки
            />
          </View>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default Educator;
