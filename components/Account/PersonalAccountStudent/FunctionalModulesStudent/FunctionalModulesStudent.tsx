import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "styled-components/native";
import {
  Container,
  ContainerFunctionalModule,
  ModuleImage,
  ModuleName,
} from "./FunctionalModulesStudentStyle";
import { Text, Pressable, ScrollView } from "react-native";
import { getSemesterGrades } from "../../../../api/apiUserStudent";

interface Settings {
  SettingsSlice: {
    isConnected: boolean;
    theme: any;
  };
}
interface ASD {
  aSlice: {
    courseData: {};
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
  const dispatch = useDispatch()
  const theme = useSelector((state: Settings) => state.SettingsSlice.theme);
  const a = useSelector((state: ASD) => state.aSlice.courseData);
  return (
    <ThemeProvider theme={theme}>
      <ScrollView>
        <Container>
          <Pressable onPress={() => getSemesterGrades(dispatch)}>
            <Text>qwe</Text>
          </Pressable>
          {mass.map((item, index) => (
            <Pressable key={index} >
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
