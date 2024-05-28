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
import {
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { RootStackParamList } from "../../../../Navigate";
import { StackNavigationProp } from "@react-navigation/stack";
import { getSemesterGrades } from "../../../../api/apiUserStudent";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
type FunctionalModulesStudentProps = {
  navigation: StackNavigationProp<RootStackParamList>;
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
const mass = [
  { name: "Зачётная книжка" },
  { name: "Библиотека" },
  { name: "Личные данные" },
];
const FunctionalModulesStudent: React.FC<FunctionalModulesStudentProps> = ({
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
      case "Личные данные":
        return require("../../../../assets/ReportCard.png");
      default:
        return;
    }
  }; //для смены картинки
  return (
    <ThemeProvider theme={theme}>
      <View style={{ marginTop: screenHeight * 0.12 }}>
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
                      : item.name === "Личные данные"
                      ? navigation.navigate("FullInfoStudent")
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
      </View>
    </ThemeProvider>
  );
};

export default FunctionalModulesStudent;
