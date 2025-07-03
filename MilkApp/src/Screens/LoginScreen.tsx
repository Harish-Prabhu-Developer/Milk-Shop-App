// LoginScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import CustomInput from "@Utils/CustomInput"; // import your CustomInput
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StatusBar } from "react-native";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation<StackNavigationProp<any>>(); // Assuming you have set up navigation
  // Animations
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const formOpacity = useSharedValue(0);

  useEffect(() => {
    logoScale.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });

    logoOpacity.value = withTiming(1, {
      duration: 1200,
      easing: Easing.out(Easing.exp),
    });

    formOpacity.value = withTiming(1, {
      duration: 1400,
      easing: Easing.out(Easing.exp),
    });
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoScale.value }],
      opacity: logoOpacity.value,
    };
  });

  const formAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: formOpacity.value,
    };
  });

  const handleLogin = () => {
    console.log("Logging in with", email, password);
    // TODO: your login logic
    navigation.navigate("TabBar"); // Navigate to TabBar after login
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, }}
        keyboardShouldPersistTaps="handled">

        <View className="flex-1 justify-center px-6 py-4" style={{ paddingTop: 80, paddingBottom: 40, paddingHorizontal: 24 }}>
            <StatusBar barStyle={"dark-content"} />
          {/* App Logo with Animation */}
          <Animated.View style={logoAnimatedStyle} className="items-center mb-6">
            <Image
              source={require("@assets/image.png")}
              style={{ width: 160, height: 160, borderRadius: 50 }}
              resizeMode="contain"
            />
            <Text className="text-primary text-3xl font-bold mt-2">
              Welcome Back
            </Text>
            <Text className="text-gray-500 text-base mt-1">
              Login to continue
            </Text>
          </Animated.View>

          {/* Form with fade-in */}
          <Animated.View style={formAnimatedStyle}>

            {/* Email Field */}
            <View className="mb-4">
              <CustomInput
                type="email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                iconColor="#3D8BFD"
                cursorColor="#3D8BFD"
                iconSize={15}
                placeholderTextColor="#A0AEC0"
              />
            </View>

            {/* Password Field */}
            <View className="mb-16">
              <CustomInput
                type="password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                iconColor="#3D8BFD"
                cursorColor="#3D8BFD"
                placeholderTextColor="#A0AEC0"
                eyeiconColor="#3D8BFD"
                eyeiconSize={14}
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className="bg-primary rounded-xl py-4 mb-8"
              onPress={handleLogin}
            >
              <Text className="text-white text-center text-lg font-semibold">
                Login
              </Text>
            </TouchableOpacity>

            {/* Forgot Password */}
            <TouchableOpacity>
              <Text className="text-right underline text-md text-gray-500 mb-8">
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Register Link */}
            <View className="flex-row justify-center mb-32">
              <Text className="text-gray-500 text-sm">Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
                <Text className="text-primary font-semibold text-sm">Register</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
