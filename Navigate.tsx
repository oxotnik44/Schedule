import React, { useEffect } from "react";
import {
  Image,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Departments from "./components/Departments/Departments";
import Educator from "./components/Educator/Educator";
import Schedule from "./components/Schedule/Schedule";
import SelectedMyGroups from "./components/SelectedMyGroups/SelectedMyGroups";
import Groups from "./components/Groups/Groups";
import News from "./components/News/News";
import ScheduleEducator from "./components/Schedule/ScheduleEducator";
import { ThemeProvider } from "styled-components/native";
import Settings from "./components/Settings/Settings";
import { StackNavigationProp } from "@react-navigation/stack";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import { getDepartments } from "./api/apiDepartments";
import { getEducator } from "./api/apiEducator";
import { getNews } from "./api/apiNews";
import { getGroups } from "./api/apiGroups";
import { useAppDispatch, useAppSelector } from "./redux/store";
import { setConnectionStatus } from "./redux/slices/SettingsSlice";
import { resetTextSearchGroup } from "./redux/slices/DepartmentsInfoSlice";
import Account from "./components/Account/Account";
import RecordBookModulesStudent from "./components/Account/PersonalAccountStudent/FunctionalModulesStudent/RecordBookModulesStudents/RecordBookModulesStudent";
import Library from "./components/Account/PersonalAccountStudent/FunctionalModulesStudent/Library/Library";
import FullInfoStudent from "./components/Account/PersonalAccountStudent/FunctionalModulesStudent/FullInfoStudent/FullInfoStudent";

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
  Account: undefined;
  RecordBookModulesStudent: undefined;
  СurrentGradesModulesStudent: undefined;
  Library: undefined;
  FullInfoStudent: undefined;
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
  SettingsSlice: {
    theme: any;
  };
};
interface SettingsState {
  SettingsSlice: {
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
    } else if (route.name === "Account") {
      iconSource = require("./assets/Account.png");
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
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state: ITheme) => state.SettingsSlice.theme);
  const selectGroup = useAppSelector(
    (state) => state.GroupsInfoSlice.selectedGroupName
  );
  const selectEducator = useAppSelector(
    (state) => state.EducatorInfoSlice.selectNameEducator
  );
  const selectDepartments = useAppSelector(
    (state) => state.DepartmentInfoSlice.selectNameDepartments
  );
  const isConnected = useAppSelector(
    (state) => state.SettingsSlice.isConnected
  );
  const getHeaderTitle = (route: { name: string }) => {
    switch (route.name) {
      case "ScheduleMyGroups":
        return "Моя группа";
      case "Departments":
        return "Расписание";
      case "SearchGroups":
        return "Поиск группы";
      case "Groups":
        return selectDepartments;
      case "Schedule":
        return selectGroup;
      case "ScheduleEducator":
        return selectEducator;
      case "Educator":
        return "Преподаватели";
      case "SelectedMyGroups":
        return "Избранное";
      case "News":
        return "Новости";
      case "Settings":
        return "Настройки";
      case "Authorization":
        return "Авторизация";
      case "Account":
        return "Аккаунт";
      case "RecordBookModulesStudent":
        return "Зачётная книжка";
      case "СurrentGradesModulesStudent":
        return "Текущие оценки";
      case "Library":
        return "Библиотека";
      case "FullInfoStudent":
        return "Личные данные";
      default:
        return null; // Возвращаем null в случае, если название маршрута не соответствует ни одному из кейсов
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
            name="Account"
            component={Account}
            options={({ navigation }) => ({
              tabBarLabel: "Аккаунт",
              tabBarLabelStyle: {
                fontSize: screenWidth * 0.025,
                fontFamily: "Montserrat-Bold",
                color: theme.navigateColor,
              },
              tabBarButton: (props) => (
                <TouchableOpacity
                  {...props}
                  onPress={() => {
                    navigation.navigate("Account");
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
            name="Library"
            component={Library}
            options={{ tabBarButton: () => null }}
          />
          <Tab.Screen
            name="RecordBookModulesStudent"
            component={RecordBookModulesStudent}
            options={{ tabBarButton: () => null }}
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
            name="FullInfoStudent"
            component={FullInfoStudent}
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
