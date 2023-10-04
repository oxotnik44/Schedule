import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Switch,
  Dimensions,
  Linking,
  Pressable,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import {
  lightTheme,
  setTheme,
  darkTheme,
} from "../../redux/reducers/settingsReducer";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
type ITheme = {
  settingsReducer: {
    theme: any;
  };
};
const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Состояние для темной темы
  const theme = useSelector((state: ITheme) => state.settingsReducer.theme);

  useEffect(() => {
    if (theme === lightTheme) {
      setIsDarkMode(false);
    } else if (theme === darkTheme) {
      setIsDarkMode(true);
    }
  }, [theme]);
  // Функция для переключения темы
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);

    if (isDarkMode) {
      dispatch(setTheme("lightTheme"));
    } else {
      dispatch(setTheme("darkTheme"));
    }
  };

  const dispatch = useDispatch();
  return (
    <View style={{ backgroundColor: theme.backgroundColor, flex: 1 }}>
      <View>
        <Text
          style={{
            fontSize: screenWidth * 0.05,
            color: theme.textColor,
            fontFamily: "Montserrat-SemiBold",
            textAlign: "center",
            marginTop: screenHeight * 0.02,
          }}
        >
          Смена цветовой темы приложения
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              fontSize: screenWidth * 0.045,
              color: theme.textColor,
              fontFamily: "Montserrat-SemiBold",
              textAlign: "center",
              marginTop: screenHeight * -0.01,
            }}
          >
            {isDarkMode ? "Включить светлую тему" : "Включить темную тему"}
          </Text>
          <Switch // Переключатель для смены темы
            trackColor={{ false: "#767577", true: "#FFFFFF" }}
            thumbColor={isDarkMode ? "#004C6F" : "#FFFFFF"}
            value={isDarkMode} // Значение переключателя
            onValueChange={toggleDarkMode} // Функция при изменении значения
            style={{
              marginLeft: screenWidth * 0.03 // Увеличьте размер переключателя
            }}
          />
        </View>
      </View>

      <View>
        <Text
          style={{
            fontSize: screenWidth * 0.045,
            color: theme.textColor,
            fontFamily: "Montserrat-SemiBold",
            textAlign: "center",
            marginTop: screenHeight * 0.02,
          }}
        >
          Политика конфиденциальности
        </Text>
        <Pressable
          onPress={() => {
            Linking.openURL("https://schedule.nspu.ru/api/Privacy_policy.html");
          }}
          style={{
            height: screenHeight * 0.05,
            width: screenWidth * 0.5,
            backgroundColor: theme.mainColor,
            borderRadius: 20,
            marginTop: screenHeight * 0.02,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              fontSize: screenWidth * 0.045,
              color: theme === lightTheme ? "#FFFFFF" : "#004C6F",
              fontFamily: "Montserrat-SemiBold",
            }}
          >
            Privacy policy
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
export default Settings;
