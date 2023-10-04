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
import {
  darkTheme,
  lightTheme,
  setTheme,
} from "./redux/reducers/settingsReducer";
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
          width: size,
          height: size,
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

  // const fetchScheduleIfNeeded = async () => {
  //   const storedGroups = await AsyncStorage.getItem("favoriteGroups");
  //   if (storedGroups) {
  //     const parsedGroups: { idGroup: number; nameGroup: string }[] =
  //       JSON.parse(storedGroups);
  //     const idGroup = parsedGroups[0]?.idGroup;
  //     if (idGroup) {
  //       try {
  //         await getSchedule(idGroup, dispatch);
  //       } catch (error) {
  //         // Обработка ошибки
  //         alert("Произошла ошибка: " + error);
  //         // Дополнительные действия по обработке ошибки
  //       }
  //     }
  //   }
  // };
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
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <Stack.Screen
          name="Home"
          component={Navigate}
          options={({ navigation }) => ({
            title: "Главная",
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("Settings")}
                style={{ marginLeft: 10 }}
              >
                <Image
                  source={require("./assets/Settings.png")}
                  style={{ width: 30, height: 30 }}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen name="Settings" component={Settings} />
        <Tab.Navigator
          backBehavior="history"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, size, color }) =>
              getTabIcon({ route, focused, size, color: theme.navigateColor }),
            tabBarStyle: {
              paddingBottom: 5,
              backgroundColor: theme.mainColor,
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
              fontSize: 25,
              fontFamily: "Montserrat-SemiBold",
            },
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
            name="Settings"
            component={Settings}
            options={({ navigation }) => ({
              tabBarLabel: "Настройки",
              tabBarLabelStyle: {
                color: theme.navigateColor,
              },
              tabBarButton: () => null,
              headerLeft: () => {
                return (
                  <TouchableOpacity
                    style={{ marginLeft: screenWidth * 0.065 }}
                    onPress={() => {
                      navigation.navigate("Settings");
                    }}
                  >
                    <Image
                      resizeMode="contain"
                      source={require("./assets/Settings.png")}
                    />
                  </TouchableOpacity>
                );
              },
            })}
          />
          <Tab.Screen
            name="News"
            component={News}
            options={({ navigation }) => ({
              tabBarLabel: "Новости",
              tabBarLabelStyle: {
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
