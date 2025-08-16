import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AppDrawer from './AppDrawer';
import { useEffect, useState } from 'react';
import { Product } from '../@types/Product';
import ProductDetailScreen from '../screens/Products/ProductDetailScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';


type RootStackParamList = {
    LoginScreen: undefined;
    RegisterScreen: undefined;
    Drawer: undefined;
    ProductDetailScreen: { Product: Product };
}
const Stack = createStackNavigator<RootStackParamList>();

const MyStack = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
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
    <Stack.Navigator screenOptions={{ headerShown: false }}
            initialRouteName={isLoggedIn ? "Drawer" : "LoginScreen"}>
        <Stack.Screen name='LoginScreen' component={LoginScreen} />
        <Stack.Screen name='RegisterScreen' component={RegisterScreen} />
        <Stack.Screen name='Drawer' component={AppDrawer} />
        <Stack.Screen name='ProductDetailScreen' component={ProductDetailScreen} />
    </Stack.Navigator>
  )
}

export default MyStack

