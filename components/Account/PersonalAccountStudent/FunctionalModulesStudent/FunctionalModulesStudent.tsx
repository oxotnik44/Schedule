import React from "react";
import { useSelector } from "react-redux";
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

// type CurrentGradesProps = {
//   navigation: StackNavigationProp<RootStackParamList, "СurrentGrades">;
// };

interface Settings {
  SettingsSlice: {
    isConnected: boolean;
    theme: any;
  };
}
const mass = [{ name : "Зачетная книжка"}, { name: "Оценки" }];
const FunctionalModulesStudent = () => {
  const isConnected = useSelector(
    (state: Settings) => state.SettingsSlice.isConnected
  );
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
          {mass.map((item, index) => (
            <Pressable key={index} onPress={() => {}}>
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
