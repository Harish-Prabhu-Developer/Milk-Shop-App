import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import CustomInput from "../components/Input/CustomInput";

const LoginScreen = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation<StackNavigationProp<any>>();

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

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
  }));

  const handleLogin = () => {
    console.log("Logging in with", phone, password);
    navigation.navigate("Drawer");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-background"
    >
      <StatusBar barStyle="dark-content" />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-center px-2 py-2">
          {/* Animated Logo */}
        <Animated.View style={logoAnimatedStyle} className="items-center mb-8">
          <Image
            source={require("../assets/logo.png")}
            style={{ width: 120, height: 120, borderRadius: 30 }}
            resizeMode="contain"
          />
          <Text className="text-3xl font-bold text-primary mt-3">Welcome Back</Text>
          <Text className="text-gray-500 text-base mt-1">Login to continue</Text>

          {/* Admin Badge */}
          <Text className="text-sm font-medium text-white bg-primary/90 px-4 py-1 rounded-full mt-2">
            Admin Panel
          </Text>
        </Animated.View>


          {/* Login Card */}
          <Animated.View style={formAnimatedStyle}>
            <View className="bg-white rounded-2xl shadow-md p-6 mb-8">
              <CustomInput
                type="phone"
                placeholder="Phone number"
                value={phone}
                onChangeText={setPhone}
                iconColor="#3D8BFD"
                cursorColor="#3D8BFD"
                iconSize={18}
                placeholderTextColor="#A0AEC0"
              />

              <View className="mt-4">
                <CustomInput
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  iconColor="#3D8BFD"
                  cursorColor="#3D8BFD"
                  placeholderTextColor="#A0AEC0"
                  eyeiconColor="#3D8BFD"
                  eyeiconSize={18}
                />
              </View>

              <TouchableOpacity className="mt-3 self-end">
                <Text className="text-sm text-primary font-medium">Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                className="mt-6 bg-primary rounded-xl py-4 shadow-sm"
                onPress={handleLogin}
                style={{
                  backgroundColor: "#3D8BFD",
                  shadowColor: "#3D8BFD",
                  shadowOpacity: 0.2,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 3 },
                }}
              >
                <Text className="text-center text-white text-base font-semibold">
                  Login
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up Prompt */}
            <View className="flex-row justify-center">
              <Text className="text-gray-500">Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text className="text-primary font-medium underline">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
