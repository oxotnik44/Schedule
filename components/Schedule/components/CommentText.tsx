import { Text } from "react-native";
import { Linking } from "react-native";

interface CommentTextProps {
  comment: string;
  textColor: string;
}

export const CommentText: React.FC<CommentTextProps> = ({
  comment,
  textColor,
}) => {
  if (!comment) return null;

  const isLink =
    /^(https?:\/\/|www\.|https?:\/\/www\.)[\w\-.]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(
      comment
    );

  return (
    <Text
      style={{
        textAlign: "center",
        color: textColor,
        fontFamily: "Montserrat-SemiBold",
      }}
    >
      {isLink ? (
        <Text
          style={{ textDecorationLine: "underline" }}
          onPress={() => Linking.openURL(comment)}
        >
          Ссылка
        </Text>
      ) : (
        comment
      )}
    </Text>
  );
};
