import React, { useState } from "react";
import { View, FlatList, Dimensions, ToastAndroid } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";

import { RootStackParamList } from "../../Navigate";
import { setNameEducator } from "../../redux/slices/EducatorSlice";

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

import {
  setDataScheduleEducator,
  setIsFullScheduleEducator,
  setSelectIdEducator,
} from "../../redux/slices/ScheduleEducatorInfoSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddFavorite from "../../helper/AddFavorite/AddFavorite";
import { FlashList } from "@shopify/flash-list";
const screenWidth = Dimensions.get("window").width;

type EducatorProps = {
  navigation: StackNavigationProp<RootStackParamList, "Educator">;
};

interface EducatorState {
  EducatorInfoSlice: {
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
  SettingsSlice: {
    theme: any;
  };
};
interface Settings {
  SettingsSlice: {
    isConnected: boolean;
  };
}
const Educator: React.FC<EducatorProps> = ({ navigation }) => {
  const { dataEducator } = useSelector(
    (state: EducatorState) => state.EducatorInfoSlice
  );
  const isConnected = useSelector(
    (state: Settings) => state.SettingsSlice.isConnected
  );
  const [searchEducator, setSearchEducator] = useState("");
  const dispatch = useDispatch();
  const theme = useSelector((state: ITheme) => state.SettingsSlice.theme);
  const filteredData = dataEducator.filter((item) => {
    const educatorName = item.nameEducator.toLocaleLowerCase();
    const educatorValue = searchEducator.toLocaleLowerCase();

    return educatorName.includes(educatorValue);
  });
  const fetchNoConnected = async (idEducator: number) => {
    console.log(idEducator);
    const storedSchedule = await AsyncStorage.getItem("favoriteSchedule");
    const scheduleEducator = storedSchedule
      ? JSON.parse(storedSchedule)
      : { groups: [], educators: [] };

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
          } else {
            dispatch(setNameEducator(nameEducator));
            dispatch(setIsFullScheduleEducator(false));
            dispatch(setSelectIdEducator(idEducator));
            await getScheduleEducator(dispatch, idEducator);
            navigation.navigate("ScheduleEducator");
          }
        }}
      >
        <View style={{ width: screenWidth * 0.63 }}>
          <NameEducators numberOfLines={2}>{nameEducator}</NameEducators>
          <RegaliaEducators>Учёное звание: {regaliaEducator}</RegaliaEducators>
        </View>
        <View>
          <AddFavorite
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

            <FlashList
              data={filteredData}
              renderItem={renderItemEducator}
              showsHorizontalScrollIndicator={false}
              estimatedItemSize={100}
            />
          </View>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default Educator;
