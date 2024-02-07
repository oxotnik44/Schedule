import React, { useEffect, useState } from "react";
import { View, Text, Switch, Dimensions, Linking } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  lightTheme,
  setTheme,
  darkTheme,
} from "../../redux/reducers/SettingsSlice";
import {
  BtnPrivacyPolicy,
  TextIncorporateTheme,
  TextPrivacyPolicy,
  TextSwitchTheme,
} from "./SettingsStyle";

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
    setIsDarkMode(theme === darkTheme);
  }, [theme]);

  // Функция для переключения темы
  const toggleDarkMode = () => {
    const newMode = isDarkMode ? "lightTheme" : "darkTheme";
    setIsDarkMode(!isDarkMode);
    dispatch(setTheme(newMode));
  };

  const dispatch = useDispatch();
  return (
    <View style={{ backgroundColor: theme.backgroundColor, flex: 1 }}>
      <View>
        <TextSwitchTheme>Смена цветовой темы приложения</TextSwitchTheme>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <TextIncorporateTheme>
            {isDarkMode ? "Включить светлую тему" : "Включить темную тему"}
          </TextIncorporateTheme>
          <Switch // Переключатель для смены темы
            trackColor={{ false: "#767577", true: "#FFFFFF" }}
            thumbColor={isDarkMode ? "#004C6F" : "#FFFFFF"}
            value={isDarkMode} // Значение переключателя
            onValueChange={toggleDarkMode} // Функция при изменении значения
            style={{
              marginLeft: screenWidth * 0.04,
              transform: [
                { scaleX: screenWidth * 0.003 },
                { scaleY: screenWidth * 0.003 },
              ],
              // Увеличьте размер переключателя
            }}
          />
        </View>
      </View>

      <View>
        <TextPrivacyPolicy>Политика конфиденциальности</TextPrivacyPolicy>
        <BtnPrivacyPolicy
          onPress={() => {
            Linking.openURL("https://schedule.nspu.ru/api/Privacy_policy.html");
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
        </BtnPrivacyPolicy>
      </View>
    </View>
  );
};
export default Settings;
