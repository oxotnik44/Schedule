import React from "react";
import { View, Dimensions, Text } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import styled from "styled-components/native";

const screenWidth = Dimensions.get("window").width;

// Стилизация компонента CommentsText
export const CommentsText = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: ${screenWidth * 0.034}px;
  font-family: "Montserrat-SemiBold";
  text-align: center;
`;

// Стилизация контейнера элемента карусели
const CarouselItemContainer = styled.View`
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  margin-vertical: 10px;
  align-items: center;
  justify-content: center;
  width: ${screenWidth * 0.8}px; // Ширина элемента карусели
`;

// Рендеринг элемента карусели
const renderItem = ({ item }: { item: string }) => (
  <CarouselItemContainer>
    <CommentsText>{item}</CommentsText>
  </CarouselItemContainer>
);

// Пример использования Carousel с renderItem
const MyCarouselComponent = ({ weeksArray }: { weeksArray: string[] }) => {
  // Проверяем, что weeksArray не пустой
  if (weeksArray.length === 0) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <Carousel
        loop
        width={screenWidth}
        height={200} // Задайте высоту карусели по необходимости
        data={weeksArray}
        renderItem={renderItem}
        scrollAnimationDuration={300} // Длительность анимации прокрутки
      />
    </View>
  );
};

export default MyCarouselComponent;
