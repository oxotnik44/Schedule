import React, { useEffect } from "react";
import {
  Image,
  Pressable,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import Departments from "./components/Departments/Departments";
import Educator from "./components/Educator/Educator";
import Schedule from "./components/Schedule/Schedule";
import { useDispatch, useSelector } from "react-redux";
import SelectedMyGroups from "./components/SelectedMyGroups/SelectedMyGroups";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSchedule } from "./api/apiSchedule";
import Groups from "./components/Groups/Groups";
import News from "./components/News/News";
import { resetTextSearchGroup } from "./redux/reducers/departmentsInfoReducer";
import ScheduleEducator from "./components/Schedule/ScheduleEducator";
import { ThemeProvider } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import Settings from "./components/Settings/Settings";
import {
  StackNavigationProp,
  createStackNavigator,
} from "@react-navigation/stack";

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
const Stack = createStackNavigator();
type ITheme = {
  settingsReducer: {
    theme: any;
  };
};
type GroupsProps = {
  navigation: StackNavigationProp<RootStackParamList, "Settings">;
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
          width: screenWidth * 0.06,
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
      return "Преподователи";
    } else if (route.name === "SelectedMyGroups") {
      return "Избранное";
    } else if (route.name === "News") {
      return "Новости";
    } else if (route.name === "Settings") {
      return "Настройки";
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <Tab.Navigator
          backBehavior="history"
          screenOptions={({ route, navigation }) => ({
            tabBarIcon: ({ focused, size, color }) =>
              getTabIcon({ route, focused, size, color: theme.navigateColor }),
            tabBarStyle: {
              paddingBottom: 5,
              backgroundColor: theme.mainColor,
              height: screenHeight * 0.08,
              // Цвет tabBar
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
              fontSize: screenWidth * 0.06,
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
              tabBarLabel: "Моя группа",
              tabBarLabelStyle: {
                fontSize: screenWidth * 0.03,

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
                fontSize: screenWidth * 0.03,

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
              tabBarLabel: "Преподватели",
              tabBarLabelStyle: {
                fontSize: screenWidth * 0.03,
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
                fontSize: screenWidth * 0.03,

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
