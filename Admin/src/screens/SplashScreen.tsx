import React, { useEffect } from "react";
import { View, Text, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";

const SplashScreen: React.FC = () => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const bottomOpacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(1, {
      duration: 1200,
      easing: Easing.out(Easing.exp),
    });

    opacity.value = withDelay(
      300,
      withTiming(1, { duration: 1000 }, (finished) => {
        if (finished) {
          bottomOpacity.value = withTiming(1, { duration: 1000 });
        }
      })
    );
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const bottomAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: bottomOpacity.value,
    };
  });

  return (
    <View className="flex-1 h-screen bg-primary items-center justify-center mb-8">
      <Animated.View style={logoAnimatedStyle} className={'items-center'}>
        <Image
          source={require("../assets/logo.png")}
          style={{ width: 150, height: 150, borderRadius: 75 }}
          resizeMode="contain"
        />
        <Text className="text-background text-2xl text-center font-bold mt-4">
          Dairy  Drop Admin
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          bottomAnimatedStyle,
          {
            position: "absolute",
            bottom: 100,
            alignItems: "center",
          },
        ]}
      >
        <Text className="text-white text-xl text-center font-bold">
          Powered by Bifrost Enterprises
        </Text>
      </Animated.View>
    </View>  );
};

export default SplashScreen;
