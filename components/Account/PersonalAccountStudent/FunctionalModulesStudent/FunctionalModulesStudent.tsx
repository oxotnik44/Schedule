import React from "react";
import { useSelector } from "react-redux";
import { ThemeProvider } from "styled-components/native";
import {
  Container,
  ContainerFunctionalModule,
  ModuleImage,
  ModuleName,
} from "./FunctionalModulesStudentStyle";
import { Pressable, ScrollView } from "react-native";

interface Settings {
  SettingsSlice: {
    isConnected: boolean;
    theme: any;
  };
}
const mass = [
  { name: "1" },
  { name: "12" },
  { name: "123" },
  { name: "123" },
  { name: "12" },
  { name: "123" },
  { name: 51 },
];
const FunctionalModulesStudent = () => {
  const isConnected = useSelector(
    (state: Settings) => state.SettingsSlice.isConnected
  );
  const theme = useSelector((state: Settings) => state.SettingsSlice.theme);
  return (
    <ThemeProvider theme={theme}>
      <ScrollView>
        <Container>
          {mass.map((item, index) => (
            <Pressable key={index} onPress={() => {}}>
              <ContainerFunctionalModule
                style={{
                  height: 150,
                  width: 150,
                  marginLeft: index % 2 === 0 ? 10 : 20,
                }}
              >
                <ModuleImage
                  resizeMode="contain"
                  source={require("../../../../assets/Departments.png")}
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
