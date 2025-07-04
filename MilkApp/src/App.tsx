import { StyleSheet } from "react-native";
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

type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  ProductDetailsScreen: Product;
  TabBar: undefined;
  CartScreen: undefined;

};
const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // 3 sec splash

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
 <Provider store={Store}>
  <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={isLoggedIn ? "TabBar" : "LoginScreen"}
      >
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="ProductDetailsScreen" component={ProductDetailsScreen} />
        <Stack.Screen name="TabBar" component={TabBar} />
        <Stack.Screen name="CartScreen" component={CartScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
 </Provider>

  );
};

export default App;

const styles = StyleSheet.create({});
