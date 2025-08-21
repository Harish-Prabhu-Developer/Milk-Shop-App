// ProfileScreen.tsx
import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { API_URL } from "@env";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

interface Branch {
  _id: string;
  branchName: string;
  email: string;
  phone: string;
  address?: string;
  contactPerson?: string;
  location?: string;
  role: string;
  type: string;
  registeredDate: string;
}

const ProfileScreen = () => {
  // const [branch, setBranch] = useState<Branch | null>(null);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem("token"); // stored after login
  //       const res = await axios.get(`${API_URL}/branch/profile`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       setBranch(res.data);
  //     } catch (error) {
  //       console.error("Profile fetch error:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchProfile();
  // }, []);

  // if (loading) {
  //   return (
  //     <View className="flex-1 justify-center items-center bg-gray-100">
  //       <ActivityIndicator size="large" color="#6366f1" />
  //       <Text className="mt-2 text-gray-500">Loading Profile...</Text>
  //     </View>
  //   );
  // }

  // if (!branch) {
  //   return (
  //     <View className="flex-1 justify-center items-center bg-gray-100">
  //       <Text className="text-red-500">Failed to load profile</Text>
  //     </View>
  //   );
  // }

  const navigation = useNavigation<StackNavigationProp<any>>();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('isLoggedIn');
    navigation.navigate('LoginScreen');
  };

  return (
    <View className="flex-1 bg-gray-100">
      <Header title="Branch Profile" />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Profile Card */}
        <View className="bg-white rounded-2xl shadow-md p-6 items-center">
          <Image
            source={require("../assets/Images/Profile.png")}
            className="w-28 h-28 rounded-full border-4 border-indigo-500"
          />
          <Text className="text-2xl font-bold mt-4 text-gray-800">
            Admin
          </Text>
          <Text className="text-sm text-gray-500 capitalize">{'admin'}</Text>
          <Text className="text-sm text-indigo-500">NKC </Text>

          {/* Registered Date */}
          <Text className="mt-3 text-gray-500 text-xs">
            Registered: {new Date().toDateString()}
          </Text>
        </View>

        {/* Contact Info */}
        <View className="bg-white rounded-2xl shadow-md mt-6 p-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Contact Information
          </Text>

          <View className="flex-row items-center mb-3">
            <Icon name="email" size={22} color="#6366f1" />
            <Text className="ml-3 text-gray-700">test@gmail.com</Text>
          </View>

          <View className="flex-row items-center mb-3">
            <Icon name="phone" size={22} color="#6366f1" />
            <Text className="ml-3 text-gray-700">9078233467</Text>
          </View>


            <View className="flex-row items-center mb-3">
              <Icon name="home" size={22} color="#6366f1" />
              <Text className="ml-3 text-gray-700">40,SMK STREET,SIVAKASI</Text>
            </View>


            <View className="flex-row items-center">
              <Icon name="location-on" size={22} color="#6366f1" />
              <Text className="ml-3 text-gray-700">SIVASKSI</Text>
            </View>

        </View>

        {/* Actions */}
        <View className="mt-6 flex-row justify-around">
          <TouchableOpacity className="bg-indigo-500 px-6 py-3 rounded-2xl shadow-md flex-row items-center">
            <Icon name="edit" size={20} color="white" />
            <Text className="text-white ml-2 font-semibold">Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-red-500 px-6 py-3 rounded-2xl shadow-md flex-row items-center"
            onPress={handleLogout}>
            <Icon name="logout" size={20} color="white" />
            <Text className="text-white ml-2 font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
