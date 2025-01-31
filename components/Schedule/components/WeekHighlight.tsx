import { View, Text } from "react-native";

interface WeekHighlightProps {
  weeks: string;
  currentWeekNumber: number;
  theme: any;
  lightTheme: any;
}

export const WeekHighlight: React.FC<WeekHighlightProps> = ({
  weeks,
  currentWeekNumber,
  theme,
  lightTheme,
}) => {
  if (!weeks || weeks.trim() === "") return null;

  return (
    <>
      {weeks
        .split(/(?=\()/) // Разделяем строку на части, начиная с символа '('
        .filter((part) => part.trim() !== "") // Фильтруем пустые строки
        .map((week, idx) => {
          // Извлекаем числа из строки формата "(10-12)" или одну неделю
          const weekRange = week.match(/\d+-\d+/);
          const isWithinRange = weekRange
            ? weekRange[0]
                .split("-")
                .map(Number)
                .some((num) => num === currentWeekNumber)
            : week.match(/\d+/)
            ? parseInt(week.match(/\d+/)[0], 10) === currentWeekNumber
            : false;

          // Устанавливаем цвет текста
          const textColorWeek = isWithinRange
            ? theme.textColor
            : theme === lightTheme
            ? "#a0a0a0" // Светло-серый цвет
            : "#606060"; // Темно-серый цвет

          return (
            <View key={idx} style={{ marginBottom: 5 }}>
              <Text style={{ color: textColorWeek }}>
                {week.trim() + " нед"}
              </Text>
            </View>
          );
        })}
    </>
  );
};
