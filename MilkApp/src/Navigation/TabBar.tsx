// TabBar.tsx
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@Screens/HomeScreen';
import ProfileScreen from '@Screens/ProfileScreen';
import OrderScreen from '@Screens/OrderScreen';
import MyTabBar from './MyTabBar';

type RootTabBarParamList = {
  HomeScreen: undefined;
  OrderScreen: undefined;
  ProfileScreen: undefined;

};
const Tab = createBottomTabNavigator<RootTabBarParamList>();

const TabBar = () => {
  return (
    <Tab.Navigator
    screenOptions={{
      headerShown: false,}}
  tabBar={(props) => <MyTabBar {...props} />}
>
  <Tab.Screen name="HomeScreen" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
  <Tab.Screen name="OrderScreen" component={OrderScreen} options={{ tabBarLabel: 'Orders' }} />
  <Tab.Screen name="ProfileScreen" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
</Tab.Navigator>

  );
};

export default TabBar;

const styles = StyleSheet.create({});
