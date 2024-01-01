import React, { useEffect} from "react";
import {
  Image,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer} from "@react-navigation/native";
import Departments from "./components/Departments/Departments";
import Educator from "./components/Educator/Educator";
import Schedule from "./components/Schedule/Schedule";
import { useDispatch, useSelector } from "react-redux";
import SelectedMyGroups from "./components/SelectedMyGroups/SelectedMyGroups";
import Groups from "./components/Groups/Groups";
import News from "./components/News/News";
import { resetTextSearchGroup } from "./redux/reducers/departmentsInfoReducer";
import ScheduleEducator from "./components/Schedule/ScheduleEducator";
import { ThemeProvider } from "styled-components/native";
import Settings from "./components/Settings/Settings";
import {
  StackNavigationProp,
} from "@react-navigation/stack";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import { setConnectionStatus } from "./redux/reducers/settingsReducer";
import { getDepartments } from "./api/apiDepartments";
import { getEducator } from "./api/apiEducator";
import { getNews } from "./api/apiNews";
import { getGroups } from "./api/apiGroups";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
export type RootStackParamList = {
  Schedule: undefined;
  Departments: undefined;
  SearchGroups: undefined;
  Groups: undefined;
  SelectedMyGroups: undefined;
  Educator: undefined;
  ScheduleEducator: undefined;
  News: undefined;
  Settings: undefined;
  Authorization: undefined;
};

interface TabIconProps {
  route: { name: string };
  focused: boolean;
  size: number;
  color: string;
}

interface GroupsState {
  groupsInfoReducer: {
    selectedGroupName: string;
  };
}
interface EducatorsState {
  educatorInfoReducer: {
    selectNameEducator: string;
  };
}
interface DepartmentsState {
  departmentInfoReducer: {
    selectNameDepartments: string;
  };
}
const Tab = createBottomTabNavigator();
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
type GroupsProps = {
  navigation: StackNavigationProp<RootStackParamList>;
};
const Navigate = ({ navigation }: GroupsProps) => {
  const getTabIcon = ({ route, focused, size, color }: TabIconProps) => {
    let iconSource;
    if (route.name === "Schedule") {
      iconSource = require("./assets/Heart.png");
    } else if (route.name === "Departments") {
      iconSource = require("./assets/Departments.png");
    } else if (route.name === "SearchGroups") {
      iconSource = require("./assets/Groups.png");
    } else if (route.name === "SelectedMyGroups") {
      iconSource = require("./assets/myGroup.png");
    } else if (route.name === "Educator") {
      iconSource = require("./assets/Educator.png");
    } else if (route.name === "News") {
      iconSource = require("./assets/News.png");
    }
    return (
      <Image
        source={iconSource}
        style={{
          width: screenWidth * 0.065,
          height: screenHeight * 0.05,
          tintColor: color,
          resizeMode: "contain",
        }}
      />
    );
  };
  const dispatch = useDispatch();
  const theme = useSelector((state: ITheme) => state.settingsReducer.theme);
  const selectGroup = useSelector(
    (state: GroupsState) => state.groupsInfoReducer.selectedGroupName
  );
  const selectEducator = useSelector(
    (state: EducatorsState) => state.educatorInfoReducer.selectNameEducator
  );
  const selectDepartments = useSelector(
    (state: DepartmentsState) =>
      state.departmentInfoReducer.selectNameDepartments
  );
  const isConnected = useSelector(
    (state: Settings) => state.settingsReducer.isConnected
  );
  const getHeaderTitle = (route: { name: string }) => {
    if (route.name === "ScheduleMyGroups") {
      return "Моя группа";
    } else if (route.name === "Departments") {
      return "Расписание";
    } else if (route.name === "SearchGroups") {
      return "Поиск группы";
    } else if (route.name === "Groups") {
      return selectDepartments;
    } else if (route.name === "Schedule") {
      return selectGroup;
    } else if (route.name === "ScheduleEducator") {
      return selectEducator;
    } else if (route.name === "Educator") {
      return "Преподаватели";
    } else if (route.name === "SelectedMyGroups") {
      return "Избранное";
    } else if (route.name === "News") {
      return "Новости";
    } else if (route.name === "Settings") {
      return "Настройки";
    } else if (route.name === "Authorization") {
      return "Авторизация";
    }
  };
  const getInitialData = async () => {
    await getDepartments(dispatch);
    await getEducator(dispatch);
    await getNews(dispatch);
    await getGroups(dispatch);
  };
  let pastConnection: boolean | null = null;
  let currentConnection: boolean | null = null;
  const netInfo = useNetInfo();
  useEffect(() => {
    const Connection = NetInfo.addEventListener((state) => {
      pastConnection = currentConnection;
      currentConnection = state.isConnected;
      if (pastConnection === false && state.isConnected) {
        ToastAndroid.show("Соединение восстановлено", ToastAndroid.SHORT);
        getInitialData();
        dispatch(setConnectionStatus(state.isConnected));
      } else if (pastConnection === true && !state.isConnected) {
        ToastAndroid.show("Нет соединения с интернетом", ToastAndroid.SHORT);
        dispatch(setConnectionStatus(state.isConnected));
      }
    });

    return () => {
      Connection();
    };
  }, [netInfo.isConnected, isConnected]);

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="SelectedMyGroups"
          backBehavior="history"
          screenOptions={({ route, navigation }) => ({
            tabBarIcon: ({ focused, size, color }) =>
              getTabIcon({ route, focused, size, color: theme.navigateColor }),
            tabBarStyle: {
              paddingBottom: 5,
              backgroundColor: theme.mainColor,
              height: screenHeight * 0.08,
            },
            tabBarInactiveTintColor: "#FFFFFF",
            tabBarActiveTintColor: "#FFFFFF", // Цвет активной иконки в tabBar
            tabBarLabelStyle: {
              fontFamily: "Montserrat-SemiBold", // Применяем шрифт к тексту в tabBar
            },
            headerTitle: getHeaderTitle(route),
            headerTitleAlign: "center",
            headerTintColor: theme.navigateColor, // Цвет текста в header
            headerTitleStyle: {
              fontSize: screenWidth * 0.05,
              fontFamily: "Montserrat-SemiBold",
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                <Image
                  source={require("./assets/Settings.png")} // Замените на путь к вашей иконке
                  style={{
                    resizeMode: "contain",
                    width: screenWidth * 0.09,
                    height: screenHeight * 0.05,
                    marginLeft: screenWidth * 0.04,
                    tintColor: theme.navigateColor,
                  }}
                />
              </TouchableOpacity>
            ),
            headerStyle: {
              height: 100,
              backgroundColor: theme.mainColor,
            },
          })}
        >
          <Tab.Screen
            name="SelectedMyGroups"
            component={SelectedMyGroups}
            options={({ navigation }) => ({
              tabBarLabel: "Избранное",
              tabBarLabelStyle: {
                fontSize: screenWidth * 0.025,
                fontFamily: "Montserrat-Bold",
                color: theme.navigateColor,
              },
              tabBarButton: (props) => (
                <TouchableOpacity
                  {...props}
                  onPress={() => {
                    navigation.navigate("SelectedMyGroups");
                  }}
                />
              ),
            })}
          />

          <Tab.Screen
            name="Departments"
            component={Departments}
            options={({ navigation }) => ({
              tabBarLabel: "Расписание",
              tabBarLabelStyle: {
                fontSize: screenWidth * 0.025,
                fontFamily: "Montserrat-Bold",
                color: theme.navigateColor,
              },
              tabBarButton: (props) => (
                <TouchableOpacity
                  {...props}
                  onPress={() => {
                    dispatch(resetTextSearchGroup());
                    navigation.navigate("Departments");
                  }}
                />
              ),
            })}
          />

          <Tab.Screen
            name="Educator"
            component={Educator}
            options={({ navigation }) => ({
              tabBarLabel: "Преподаватели",
              tabBarLabelStyle: {
                fontSize: screenWidth * 0.025,
                fontFamily: "Montserrat-Bold",
                color: theme.navigateColor,
              },
              tabBarButton: (props) => (
                <TouchableOpacity
                  {...props}
                  onPress={() => {
                    navigation.navigate("Educator");
                  }}
                />
              ),
            })}
          />
          <Tab.Screen
            name="Settings"
            component={Settings}
            options={{ tabBarButton: () => null }}
          />
          <Tab.Screen
            name="Groups"
            component={Groups}
            options={{ tabBarButton: () => null }}
          />
          <Tab.Screen
            name="Schedule"
            component={Schedule}
            options={{ tabBarButton: () => null, title: selectGroup }}
          />
          <Tab.Screen
            name="ScheduleEducator"
            component={ScheduleEducator}
            options={{ tabBarButton: () => null }}
          />
          <Tab.Screen
            name="News"
            component={News}
            options={({ navigation }) => ({
              tabBarLabel: "Новости",
              tabBarLabelStyle: {
                fontSize: screenWidth * 0.025,
                fontFamily: "Montserrat-Bold",
                color: theme.navigateColor,
              },
              tabBarButton: (props) => (
                <TouchableOpacity
                  {...props}
                  onPress={() => {
                    navigation.navigate("News");
                  }}
                />
              ),
            })}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default Navigate;
