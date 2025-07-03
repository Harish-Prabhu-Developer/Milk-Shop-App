// RegisterScreen.tsx
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
import CustomInput from "@Utils/CustomInput";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import DropdownComponent from "@Components/Input/DropDownList";
import BranchData from "@Constants/DummaryData/BranchData.ts"; // Adjust the import path as necessary
const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [BranchName,SetBranchName] = useState("");
  const [phone, setPhone] = useState("");
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

  const handleRegister = () => {
    console.log("Registering with", BranchName, email, phone, password);
    // TODO: your register logic
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6 py-4">

          {/* App Logo with Animation */}
          <Animated.View style={logoAnimatedStyle} className="items-center mb-6">
            <Image
              source={require("@assets/image.png")}
              style={{ width: 160, height: 160, borderRadius: 50 }}
              resizeMode="contain"
            />
            <Text className="text-primary text-3xl font-bold mt-2">
              Create Account
            </Text>
            <Text className="text-gray-500 text-base mt-1">
              Register to continue
            </Text>
          </Animated.View>

          {/* Form with fade-in */}
          <Animated.View style={formAnimatedStyle}>
            
          {/* Shop Name Field */}
            <View className="mb-4">
              <DropdownComponent
                BoxLabel="Branch Name"
                data={BranchData}
                labelField="Branch Name"
                valueField="id"
                onSelect={(item) => SetBranchName(item["Branch Name"])}
              />
            </View>

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

            {/* Phone Field */}
            <View className="mb-4">
              <CustomInput
                type="phone"
                placeholder="Enter your Phone"
                value={phone}
                onChangeText={setPhone}
                iconColor="#3D8BFD"
                cursorColor="#3D8BFD"
                iconSize={15}
                placeholderTextColor="#A0AEC0"
              />
            </View>

            {/* Password Field */}
            <View className="mb-6">
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

            {/* Address Field */}
            <View className="mb-4">
              <CustomInput
                type="phone"
                placeholder="Enter your Phone"
                value={phone}
                onChangeText={setPhone}
                iconColor="#3D8BFD"
                cursorColor="#3D8BFD"
                iconSize={15}
                placeholderTextColor="#A0AEC0"
              />
            </View>

            {/* Register Button */}
            <TouchableOpacity
              className="bg-primary rounded-xl py-4 mb-8"
              onPress={handleRegister}
            >
              <Text className="text-white text-center text-lg font-semibold">
                Register
              </Text>
            </TouchableOpacity>

            {/* Login Screen */}
            <View className="flex-row justify-center mb-36">
              <Text className="text-gray-500 text-sm">Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
                <Text className="text-primary font-semibold text-sm">Login</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
