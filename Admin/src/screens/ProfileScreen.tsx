// ProfileScreen.tsx
import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Header from "../components/Header";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppDispatch, RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../redux/slices/authSlice";

const ProfileScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const dispatch = useDispatch<AppDispatch>();

  const { branch, loading } = useSelector((state: RootState) => state.auth); // ✅ get loading + branch

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("isLoggedIn");
    navigation.navigate("LoginScreen");
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* ✅ Loading Overlay */}
      {!branch && (
        <View className="absolute top-0 left-0 right-0 bottom-0 flex-row gap-4 items-center justify-center bg-black/40 z-50">
          <ActivityIndicator size="large" color="#3D8BFD" />
          <Text className="text-white text-lg font-bold mt-2">Loading...</Text>
        </View>
      )}

      <Header title="Branch Profile" />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Profile Card */}
        <View className="bg-white rounded-2xl shadow-md p-6 items-center">
          <Image
            source={require("../assets/Images/Profile.png")}
            className="w-28 h-28 rounded-full border-4 border-indigo-500"
          />
          <Text className="text-2xl font-bold mt-4 text-gray-800">
            {branch?.branchName || "N/A"}
          </Text>
          <Text className="text-sm text-gray-500 capitalize">
            {branch?.role || "N/A"}
          </Text>
          <Text className="text-sm text-indigo-500">{branch?.type || "N/A"}</Text>

          {/* Registered Date */}
          {branch?.registeredDate && (
            <Text className="mt-3 text-gray-500 text-xs">
              Registered: {new Date(branch.registeredDate).toDateString()}
            </Text>
          )}
        </View>

        {/* Contact Info */}
        <View className="bg-white rounded-2xl shadow-md mt-6 p-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Contact Information
          </Text>

          {branch?.email && (
            <View className="flex-row items-center mb-3">
              <Icon name="email" size={22} color="#6366f1" />
              <Text className="ml-3 text-gray-700">{branch.email}</Text>
            </View>
          )}

          {branch?.phone && (
            <View className="flex-row items-center mb-3">
              <Icon name="phone" size={22} color="#6366f1" />
              <Text className="ml-3 text-gray-700">{branch.phone}</Text>
            </View>
          )}

          {branch?.address && (
            <View className="flex-row items-center mb-3">
              <Icon name="home" size={22} color="#6366f1" />
              <Text className="ml-3 text-gray-700">{branch.address}</Text>
            </View>
          )}

          {branch?.location && (
            <View className="flex-row items-center">
              <Icon name="location-on" size={22} color="#6366f1" />
              <Text className="ml-3 text-gray-700">{branch.location}</Text>
            </View>
          )}
        </View>

        {/* Actions */}
        <View className="mt-6 flex-row justify-around">
          <TouchableOpacity className="bg-indigo-500 px-6 py-3 rounded-2xl shadow-md flex-row items-center">
            <Icon name="edit" size={20} color="white" />
            <Text className="text-white ml-2 font-semibold">Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-red-500 px-6 py-3 rounded-2xl shadow-md flex-row items-center"
            onPress={handleLogout}
          >
            <Icon name="logout" size={20} color="white" />
            <Text className="text-white ml-2 font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
