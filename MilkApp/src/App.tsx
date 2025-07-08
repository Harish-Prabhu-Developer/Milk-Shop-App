import { Alert, PermissionsAndroid, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import "../global.css"; // Import global styles
import LoginScreen from "@Screens/LoginScreen";
import TabBar from "@Navigation/TabBar";
import SplashScreen from "@Screens/SplashScreen";
import RegisterScreen from "@Screens/RegisterScreen";
import ProductDetailsScreen from "./Screens/ProductDetailsScreen";
import Store from "./Redux/Store";
import { Provider } from "react-redux";
import { CartProduct, Product } from "@Utils/@types/Products";
import CartScreen from "@Screens/CartScreen";
import { Order } from "./Utils/@types/Order";
import OrderDetailScreen from "./Screens/OrderDetailScreen";
import { Platform } from "react-native";
import OrderScreen from "./Screens/OrderScreen";

type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  ProductDetailsScreen: Product;
  TabBar: undefined;
  CartScreen: undefined;
  OrderScreen: undefined;
  OrderDetailScreen: { Order:Order }; // Assuming you have an OrderDetailScreen

};
const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Splash screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Storage permission

const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const sdkInt = parseInt(String(Platform.constants?.Release || 0));
      if (sdkInt <= 10) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'We need access to save your invoice as a file.',
            buttonPositive: 'Allow',
            buttonNegative: 'Deny',
          }
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Cannot save invoices without storage access.');
          return false;
        }
      }
      return true;
    } catch (error) {
      console.warn('Permission error:', error);
      Alert.alert('Permission Error', 'Something went wrong while requesting permission.');
      return false;
    }
  }
  return true; // iOS
};

useEffect(() => {
  requestStoragePermission();
}, []);
  return (
    <Provider store={Store}>
      <NavigationContainer>
        {showSplash ? (
          <SplashScreen />
        ) : (
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName={isLoggedIn ? "TabBar" : "LoginScreen"}
          >
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            <Stack.Screen name="ProductDetailsScreen" component={ProductDetailsScreen} />
            <Stack.Screen name="TabBar" component={TabBar} />
            <Stack.Screen name="CartScreen" component={CartScreen} />
            <Stack.Screen name="OrderDetailScreen" component={OrderDetailScreen} />
            <Stack.Screen name="OrderScreen" component={OrderScreen} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
