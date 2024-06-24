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
  ToastAndroid,
  View,
} from "react-native";
import { RootStackParamList } from "../../../../Navigate";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  getLibraryBooks,
  getSemesterGrades,
} from "../../../../api/apiUserStudent";

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
        return require("../../../../assets/FullInfoStudent.png");
      default:
        return;
    }
  };

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
                    if (item.name === "Библиотека") {
                      getLibraryBooks(
                        dispatch,
                        accessToken,
                        navigation,
                        dataStudent.login
                      );
                    } else if (item.name === "Зачётная книжка") {
                      getSemesterGrades(
                        dispatch,
                        navigation,
                        accessToken,
                        dataStudent.login,
                        dataStudent.creditBook
                      );
                    } else if (item.name === "Личные данные") {
                      navigation.navigate("FullInfoStudent");
                    }
                  }
                }}
              >
                <ContainerFunctionalModule
                  style={{
                    height: screenHeight * 0.17,
                    width: screenWidth * 0.42,
                    marginLeft:
                      index % 2 === 0 ? screenWidth * 0.02 : screenWidth * 0.03,
                  }}
                >
                  <ModuleImage
                    resizeMode="contain"
                    source={getImageSource(item.name)}
                    tintColor={item.name === "Личные данные" ? "green" : undefined}
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
