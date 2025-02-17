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
          // Обрабатываем диапазоны и конкретные недели
          const weekRanges = week.split(","); // Разделяем по запятой, чтобы учесть все значения
          let isWithinRange = false;

          weekRanges.forEach((weekRange) => {
            const rangeMatch = weekRange.match(/\d+-\d+/); // Проверяем на диапазон
            const singleWeekMatch = weekRange.match(/\d+/); // Проверяем на одиночные недели

            if (rangeMatch) {
              // Если это диапазон недель, например "24-27"
              const [startWeek, endWeek] = rangeMatch[0].split("-").map(Number);
              // Проверяем, входит ли текущая неделя в диапазон
              if (
                currentWeekNumber >= startWeek &&
                currentWeekNumber <= endWeek
              ) {
                isWithinRange = true;
              }
            } else if (singleWeekMatch) {
              // Если это одиночная неделя
              const weekNumber = parseInt(singleWeekMatch[0], 10);
              if (weekNumber === currentWeekNumber) {
                isWithinRange = true;
              }
            }
          });

          // Устанавливаем цвет текста
          const textColorWeek = isWithinRange
            ? theme.textColor
            : theme === lightTheme
            ? "#a0a0a0" // Светло-серый цвет
            : "#606060"; // Темно-серый цвет

          return (
            <View key={idx} style={{ marginBottom: 5 }}>
              <Text
                style={{
                  color: textColorWeek,
                  fontFamily: "Montserrat-SemiBold",
                }}
              >
                {week.trim() + " нед"}
              </Text>
            </View>
          );
        })}
    </>
  );
};
