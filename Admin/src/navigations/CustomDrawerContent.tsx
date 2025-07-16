import React from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
const CustomDrawerContent = (props: any) => {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* Profile Header */}
      <View className="bg-primary w-full p-4 rounded-b-xl">
        <Image
          source={require('../assets/Images/Profile.png')}
          className="w-16 h-16 rounded-full mb-3"
        />
        <Text className="text-white text-lg font-bold">John Doe</Text>
        <Text className="text-white text-sm">Admin</Text>
      </View>

      {/* Navigation Items */}
      <View className="flex-1 pt-4 bg-white">
        <DrawerItemList {...props} />
      </View>

      {/* Logout Button */}
      <View className="p-4 border-t border-gray-200">
        <TouchableOpacity
          className="flex-row items-center space-x-3"
          onPress={() => console.log('Logout')}
        >
          <Ionicons name="log-out-outline" size={20} color="#dc2626" />
          <Text className="text-red-600 font-medium">Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
