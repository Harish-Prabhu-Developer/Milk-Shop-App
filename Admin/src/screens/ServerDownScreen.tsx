// ServerDownScreen.tsx
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";



export default function ServerDownScreen() {
    const navigation = useNavigation<StackNavigationProp<any>>();
  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      {/* Illustration / Icon (optional image) */}
      <Image
        source={require("../assets/Images/Profile.png")} // Place your own illustration here
        className="w-52 h-52 mb-8"
        resizeMode="contain"
      />

      {/* Title */}
      <Text className="text-2xl font-bold text-gray-800 mb-2 text-center">
        Server Unavailable
      </Text>

      {/* Subtitle */}
      <Text className="text-base text-gray-500 text-center mb-6">
        We’re having trouble connecting to the server.{"\n"}
        Please check your connection or try again later.
      </Text>

      {/* Retry Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Drawer")}
        activeOpacity={0.85}
        className="flex-row items-center px-6 py-3 bg-blue-600 rounded-2xl shadow-md"
      >
        <Icon name="reload" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text className="text-white font-semibold text-base">Retry</Text>
      </TouchableOpacity>
    </View>
  );
}
