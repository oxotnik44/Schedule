import { View, Text } from "react-native";

interface NoConnectionMessageProps {
  lastCacheEntry?: {
    currentDateCache: string;
    currentTimeCache: string;
  };
}

export const NoConnectionMessage: React.FC<NoConnectionMessageProps> = ({
  lastCacheEntry,
}) => {
  return (
    <View>
      <Text style={{ color: "red", textAlign: "center", fontSize: 16 }}>
        Отсутствует соединение.
      </Text>
      {lastCacheEntry && (
        <Text style={{ textAlign: "center", fontSize: 14 }}>
          Расписание актуально на {lastCacheEntry.currentDateCache}{" "}
          {lastCacheEntry.currentTimeCache}
        </Text>
      )}
    </View>
  );
};
