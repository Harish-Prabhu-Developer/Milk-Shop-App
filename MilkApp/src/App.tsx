import { Alert, PermissionsAndroid, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import '../global.css'; // Import global styles
import LoginScreen from '@Screens/LoginScreen';
import TabBar from '@Navigation/TabBar';
import SplashScreen from '@Screens/SplashScreen';
import RegisterScreen from '@Screens/RegisterScreen';
import ProductDetailsScreen from '@Screens/ProductDetailsScreen';
import Store from './Redux/Store';
import { Provider } from 'react-redux';
import { CartProduct, Product } from '@Utils/@types/Products';
import CartScreen from '@Screens/CartScreen';
import { Order } from '@Utils/@types/Order';
import OrderDetailScreen from '@Screens/OrderDetailScreen';
import { Platform } from 'react-native';
import OrderScreen from '@Screens/OrderScreen';
import {
  requestPushNotificationPermission,
  requestStoragePermission,
} from '@Utils/PermissionFunctions/Permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  ProductDetailsScreen: Product;
  TabBar: undefined;
  CartScreen: undefined;
  OrderScreen: undefined;
  OrderDetailScreen: { Order: Order }; // Assuming you have an OrderDetailScreen
};
const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  // Splash screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    requestPushNotificationPermission();
  }, []);
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const loggedIn = await AsyncStorage.getItem('isLoggedIn');
        console.log('isLoggedIn from AsyncStorage:', loggedIn);
        setIsLoggedIn(loggedIn === 'true');
      } catch (error) {
        console.error('Error checking login status', error);
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []);

  if (isLoggedIn === null) {
    // You can return a loading spinner here
    return null;
  }
  console.log('isLoggedIn', AsyncStorage.getItem('isLoggedIn'));

  return (
    <Provider store={Store}>
      <NavigationContainer>
        {showSplash ? (
          <SplashScreen />
        ) : (
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName={isLoggedIn ? 'TabBar' : 'LoginScreen'}
          >
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            <Stack.Screen
              name="ProductDetailsScreen"
              component={ProductDetailsScreen}
            />
            <Stack.Screen name="TabBar" component={TabBar} />
            <Stack.Screen name="CartScreen" component={CartScreen} />
            <Stack.Screen
              name="OrderDetailScreen"
              component={OrderDetailScreen}
            />
            <Stack.Screen name="OrderScreen" component={OrderScreen} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
