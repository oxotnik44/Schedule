import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "styled-components/native";
import {
  Container,
  ContainerFunctionalModule,
  ModuleImage,
  ModuleName,
  ServicesTitle,
} from "./FunctionalModulesStudentStyle";
import { Pressable, ScrollView } from "react-native";
import { RootStackParamList } from "../../../../Navigate";
import { StackNavigationProp } from "@react-navigation/stack";

type CurrentGradesProps = {
  navigation: StackNavigationProp<RootStackParamList, "СurrentGrades">;
};

interface Settings {
  SettingsSlice: {
    isConnected: boolean;
    theme: any;
  };
}
const mass = [{ name : "Зачетная книжка"}, { name: "Оценки" }];
const FunctionalModulesStudent:React.FC<CurrentGradesProps> = ({navigation}) => {
  const isConnected = useSelector(
    (state: Settings) => state.SettingsSlice.isConnected
  );
  const dispatch = useDispatch()
  const theme = useSelector((state: Settings) => state.SettingsSlice.theme);

  const getImageSource = (name: any) => {
    switch (name) {
      case "Оценки":
        return require("../../../../assets/Grades.png");
      case "Зачетная книжка":
        return require("../../../../assets/ReportCard.png");
    }
  }; //для смены картинки

  return (
    <ThemeProvider theme={theme}>
      <ServicesTitle>СЕРВИСЫ</ServicesTitle>
      <ScrollView>
        <Container>
          <Pressable onPress={() => getSemesterGrades(dispatch)}>
            <Text>qwe</Text>
          </Pressable>
          {mass.map((item, index) => (
            <Pressable key={index} onPress={() => {navigation.navigate("СurrentGrades")}}>
              <ContainerFunctionalModule
                style={{
                  height: 140,
                  width: 170,
                  marginLeft: index % 2 === 0 ? 10 : 20,
                }}
              >
                <ModuleImage
                  resizeMode="contain"
                  source={getImageSource(item.name)}
                />
                <ModuleName>{item.name}</ModuleName>
              </ContainerFunctionalModule>
            </Pressable>
          ))}
        </Container>
      </ScrollView>
    </ThemeProvider>
  );
};

export default FunctionalModulesStudent;
