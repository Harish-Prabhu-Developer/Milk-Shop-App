import React, { useEffect, useState } from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
const CustomDrawerContent = (props: any) => {
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
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* Profile Header */}
      <View className="bg-primary w-full p-4 rounded-b-xl">
        <Image
          source={require('../assets/Images/Profile.png')}
          className="w-16 h-16 rounded-full mb-3"
        />
        <Text className="text-white text-lg font-bold">{UserData.name}</Text>
        <Text className="text-white text-sm">{UserData.role}</Text>
      </View>

      {/* Navigation Items */}
      <View className="flex-1 pt-4 bg-white">
        <DrawerItemList {...props} />
      </View>

      {/* Logout Button */}
      <View className="p-4 border-t border-gray-200">
        <TouchableOpacity
          className="flex-row items-center space-x-3"
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#dc2626" />
          <Text className="text-red-600 font-medium">Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
