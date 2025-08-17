import { PermissionsAndroid, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import '../global.css';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from './screens/SplashScreen';
import { Provider } from 'react-redux';
import store from './redux/store';
import { createStackNavigator } from '@react-navigation/stack';
import { Product } from './@types/Product';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import AppDrawer from './navigations/AppDrawer';
import ProductDetailScreen from './screens/Products/ProductDetailScreen';
import { Order } from './@types/Order';
import OrderDetailScreen from './screens/Orders/OrderDetailScreen';

type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  Drawer: undefined;
  ProductDetailScreen: { Product: Product };
  OrderDetailScreen: { Order: Order };
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
    <Provider store={store}>
      <NavigationContainer>
        {showSplash ? (
          <SplashScreen />
        ) : (
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName={isLoggedIn ? 'Drawer' : 'LoginScreen'}
          >
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            <Stack.Screen name="Drawer" component={AppDrawer} />
            <Stack.Screen
              name="ProductDetailScreen"
              component={ProductDetailScreen}
            />
            <Stack.Screen
              name="OrderDetailScreen"
              component={OrderDetailScreen}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
