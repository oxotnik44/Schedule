import React, { useRef } from "react";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { StyleSheet } from "react-native";

interface SwipeableContainerProps {
  children: React.ReactNode;
  onSwipeComplete: (direction: "влево" | "вправо") => void;
}

const SwipeableContainer: React.FC<SwipeableContainerProps> = ({
  children,
  onSwipeComplete,
}) => {
  const translateX = useSharedValue(0);
  const panRef = useRef(null);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
    },
    onEnd: (event) => {
      if (event.translationX > 50) {
        runOnJS(onSwipeComplete)("вправо");
        translateX.value = withSpring(500);
      } else if (event.translationX < -50) {
        runOnJS(onSwipeComplete)("влево");
        translateX.value = withSpring(-500);
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <PanGestureHandler
      ref={panRef}
      onGestureEvent={gestureHandler}
      activeOffsetX={[-20, 20]}
      failOffsetY={[-10, 10]}
    >
      <Animated.View style={[styles.swipeable, animatedStyle]}>
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  swipeable: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default SwipeableContainer;
