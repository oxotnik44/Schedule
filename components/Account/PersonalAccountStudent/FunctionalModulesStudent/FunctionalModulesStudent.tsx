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
import { Pressable, ScrollView, Text, ToastAndroid } from "react-native";
import { RootStackParamList } from "../../../../Navigate";
import { StackNavigationProp } from "@react-navigation/stack";
import { getSemesterGrades } from "../../../../api/apiUserStudent";

type RecordBookModulesStudent = {
  navigation: StackNavigationProp<
    RootStackParamList,
    "RecordBookModulesStudent"
  >;
};
interface ProfileInfo {
  ProfileInfoSlice: {
    personalDataStudent: {
      login: string;
      fullName: string;
      numberGroup: string;
      email: string;
      creditBook: string;
    };
  };
}
interface Settings {
  SettingsSlice: {
    isConnected: boolean;
    theme: any;
  };
}
interface iTokenUser {
  AuthTokenSlice: {
    accessToken: any;
  };
}
const mass = [{ name: "Зачётная книжка" },{ name: "Библиотека" }];
const FunctionalModulesStudent: React.FC<RecordBookModulesStudent> = ({
  navigation,
}) => {
  const isConnected = useSelector(
    (state: Settings) => state.SettingsSlice.isConnected
  );
  const dataStudent = useSelector(
    (state: ProfileInfo) => state.ProfileInfoSlice.personalDataStudent
  );
  const accessToken = useSelector(
    (state: iTokenUser) => state.AuthTokenSlice.accessToken
  );
  const dispatch = useDispatch();
  const theme = useSelector((state: Settings) => state.SettingsSlice.theme);
  const getImageSource = (name: any) => {
    switch (name) {
      case "Библиотека":
        return require("../../../../assets/Grades.png");
      case "Зачётная книжка":
        return require("../../../../assets/ReportCard.png");
    }
  }; //для смены картинки
  return (
    <ThemeProvider theme={theme}>
      <ServicesTitle>СЕРВИСЫ</ServicesTitle>
      <ScrollView>
        <Container>
          {mass.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => {
                if (!isConnected) {
                  ToastAndroid.show(
                    "Нет соединения с интернетом",
                    ToastAndroid.SHORT
                  );
                } else {
                  item.name === "Зачётная книжка"
                    ? getSemesterGrades(
                        dispatch,
                        navigation,
                        accessToken,
                        dataStudent.login,
                        dataStudent.creditBook
                      )
                    : navigation.navigate("Library");
                }
              }}
            >
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
