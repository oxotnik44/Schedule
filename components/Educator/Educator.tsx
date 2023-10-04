import React, { useCallback, memo, useState } from "react";
import { View, TouchableOpacity, FlatList, Dimensions } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";

import { RootStackParamList } from "../../Navigate";
import { setNameEducator } from "../../redux/reducers/educatorReducer";

import {
  Container,
  ContainerEducators,
  ContainerSearchGroups,
  NameEducators,
  RegaliaEducators,
  SearchContainer,
  SearchImage,
  SearchInput,
} from "./EducatorStyle";
import { getScheduleEducator } from "../../api/apiSchedule";
import { ThemeProvider } from "styled-components/native";

import AddFavoriteGroups from "../Hoc/AddFavorite/AddFavorite";
import { setIsFullScheduleEducator, setSelectIdEducator } from "../../redux/reducers/scheduleEducatorInfo";
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
interface FavoriteEducatorState {
  favoriteEducatorReducer: {
    favoriteEducators: { idEducator: number; nameEducator: string }[];
  };
}
type ITheme = {
  settingsReducer: {
    theme: any;
  };
};
const Educator: React.FC<EducatorProps> = ({ navigation }) => {
  const { dataEducator } = useSelector(
    (state: EducatorState) => state.educatorInfoReducer
  );

  const [searchEducator, setSearchEducator] = useState("");
  const dispatch = useDispatch();
  const theme = useSelector((state: ITheme) => state.settingsReducer.theme);
  const filteredData = dataEducator.filter((item) => {
    const educatorName = item.nameEducator.toLocaleLowerCase();
    const educatorValue = searchEducator.toLocaleLowerCase();

    return educatorName.includes(educatorValue);
  });
  const renderItemEducator = ({ item }: { item: any }) => {
    const { idEducator, nameEducator, regaliaEducator } = item;
    return (
      <ContainerEducators
        key={idEducator}
        onPress={async () => {
          dispatch(setNameEducator(nameEducator));
          dispatch(setIsFullScheduleEducator(false));
          dispatch(setSelectIdEducator(idEducator));

          await getScheduleEducator(dispatch, idEducator);
          navigation.navigate("ScheduleEducator");
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
        <ContainerSearchGroups>
          <SearchContainer>
            <SearchInput
              value={searchEducator}
              onChangeText={(value) => setSearchEducator(value)}
              placeholder="Поиск преподователя"
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
      </Container>
    </ThemeProvider>
  );
};

export default Educator;