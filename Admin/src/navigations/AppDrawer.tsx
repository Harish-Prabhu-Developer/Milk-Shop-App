import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DashboardScreen from '../screens/DashboardScreen';
import OrderScreen from '../screens/Orders/OrderScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProductScreen from '../screens/Products/ProductScreen';
import UserScreen from '../screens/Users/UserScreen';
import ReportScreen from '../screens/Reports/ReportScreen'; // Import custom drawer

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CustomDrawerContent from './CustomDrawerContent';
import PlaceScreen from '../screens/Place/PlaceScreen';

export type DrawerParamList = {
  Dashboard: undefined;
  OrderScreen: {Tabnumber?:number};
  ProfileScreen: undefined;
  ProductScreen: undefined;
  UserScreen: undefined;
  PlaceScreen:undefined;
  ReportScreen: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const AppDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStatusBarAnimation: 'slide',
        drawerStyle: {
          backgroundColor: '#f9f9f9',
          borderTopRightRadius: '4%',
          borderBottomRightRadius: '4%',
          width: '75%',
        },
        drawerActiveTintColor: '#2563eb',
        drawerInactiveTintColor: '#555',
        drawerLabelStyle: {
          marginLeft: '-6%',
          fontSize: 16,
        },
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          drawerIcon: ({ color }) => <Ionicons name="home-outline" size={20} color={color} className='p-2' />,
        }}
        
      />
      <Drawer.Screen
        name="OrderScreen"
        component={OrderScreen}
        options={{
          drawerLabel: 'Orders',
          drawerIcon: ({ color }) => <MaterialIcons name="list-alt" size={20} color={color} className='p-2'/>,
        }}
      />
      <Drawer.Screen
        name="ProductScreen"
        component={ProductScreen}
        options={{
          drawerLabel: 'Products',
          drawerIcon: ({ color }) => <FontAwesome5 name="box-open" size={18} color={color} className='p-2' />,
        }}
      />
      <Drawer.Screen
        name="UserScreen"
        component={UserScreen}
        options={{
          drawerLabel: 'Users',
          drawerIcon: ({ color }) => <Ionicons name="people-outline" size={20} color={color} className='p-2'/>,
        }}
      />
      <Drawer.Screen
        name="PlaceScreen"
        component={PlaceScreen}
        options={{
          drawerLabel: 'Delivery Places',
          drawerIcon: ({ color }) => <MaterialIcons name="location-on" size={20} color={color} className='p-2'/>,
        }}
      />
      <Drawer.Screen
        name="ReportScreen"
        component={ReportScreen}
        options={{
          drawerLabel: 'Reports',
          drawerIcon: ({ color }) => <MaterialIcons name="bar-chart" size={20} color={color} className='p-2'/>,
        }}
      />
      <Drawer.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          drawerLabel: 'Profile',
          drawerIcon: ({ color }) => <Ionicons name="person-outline" size={20} color={color} className='p-2'/>,
        }}
      />
    </Drawer.Navigator>
  );
};

export default AppDrawer;
