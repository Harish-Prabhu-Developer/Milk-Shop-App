import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen = () => {
  const [UserData, setUserData] = useState({
    _id: '',
    name: '',
    email: '',
    phone: '',
    role: ''
  });

  useEffect(() => {
    const getName = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const decode = jwtDecode<any>(token);
        setUserData({
          _id: decode._id,
          name: decode.name,
          email: decode.email,
          phone: decode.phone,
          role: decode.role
        });
      } else {
        setUserData({
          _id: '',
          name: '',
          email: '',
          phone: '',
          role: ''
        });
        console.log("No token found");
      }
    };
    getName();
  }, []); // ✅ Only run once

  const navigation = useNavigation<StackNavigationProp<any>>();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('isLoggedIn');
    navigation.navigate('LoginScreen');
  };

  return (
    <View className="flex-1 bg-primary">
      {/* Header */}
      <View className="bg-primary pt-14 pb-6 px-6">
        <Text className="text-3xl font-bold text-white">Profile</Text>
      </View>

      {/* Profile Image and Info */}
      <View className="items-center justify-center mb-6">
        <View className="w-32 h-32 rounded-full bg-gray-100 border-4 border-white shadow-md overflow-hidden">
          <Image
            source={require('@assets/Images/Profile.png')}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <Text className="text-xl text-white font-semibold mt-4">{UserData.name}</Text>
        <Text className="text-white mt-1">{UserData.phone}</Text>
        <Text className="text-white mt-1">{UserData.email}</Text>
      </View>

      {/* Main Content */}
      <View className="flex-1">
        <ScrollView
          className="flex-1 bg-white rounded-t-3xl px-4 pt-6"
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Account Overview */}
          <View>
            <Text className="text-lg font-bold text-gray-800 mb-4">Account Overview</Text>

            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center justify-between py-4 border-b border-gray-100"
            >
              <View className="flex-row items-center space-x-4 gap-4">
                <View className="w-10 h-10 rounded-xl bg-gray-200 justify-center items-center">
                  <Icon name="person" size={24} color="#3D8BFD" />
                </View>
                <Text className="text-gray-700 text-base">Edit Profile</Text>
              </View>
              <Icon name="keyboard-arrow-right" size={24} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center justify-between py-4 border-b border-gray-100"
            >
              <View className="flex-row items-center space-x-4 gap-4">
                <View className="w-10 h-10 rounded-xl bg-gray-200 justify-center items-center">
                  <Icon name="location-on" size={24} color="#3D8BFD" />
                </View>
                <Text className="text-gray-700 text-base">Manage Saved Address</Text>
              </View>
              <Icon name="keyboard-arrow-right" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Settings */}
          <View className="mt-8">
            <Text className="text-lg font-bold text-gray-800 mb-4">Settings</Text>

            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center justify-between py-4 border-b border-gray-100"
            >
              <View className="flex-row items-center space-x-4 gap-4">
                <View className="w-10 h-10 rounded-xl bg-gray-200 justify-center items-center">
                  <Icon name="lock" size={24} color="#3D8BFD" />
                </View>
                <Text className="text-gray-700 text-base">Change Password</Text>
              </View>
              <Icon name="keyboard-arrow-right" size={24} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center justify-between py-4 border-b border-gray-100"
            >
              <View className="flex-row items-center space-x-4 gap-4">
                <View className="w-10 h-10 rounded-xl bg-gray-200 justify-center items-center">
                  <Icon name="privacy-tip" size={24} color="#3D8BFD" />
                </View>
                <Text className="text-gray-700 text-base">Privacy Policy</Text>
              </View>
              <Icon name="keyboard-arrow-right" size={24} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center justify-between py-4"
            >
              <View className="flex-row items-center space-x-4 gap-4">
                <View className="w-10 h-10 rounded-xl bg-gray-200 justify-center items-center">
                  <Icon name="info" size={24} color="#3D8BFD" />
                </View>
                <Text className="text-gray-700 text-base">Terms of Service</Text>
              </View>
              <Icon name="keyboard-arrow-right" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Logout Button */}
      <View className="px-6 pb-32 bg-white border-t border-gray-200">
        <TouchableOpacity
          activeOpacity={0.8}
          className="bg-red-500 rounded-xl py-3 items-center shadow-md"
          onPress={handleLogout}
        >
          <Text className="text-white font-bold text-base tracking-wide">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;
