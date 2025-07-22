import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AppDrawer from './AppDrawer';
import { useState } from 'react';
import { Product } from '../@types/Product';
import ProductDetailScreen from '../screens/Products/ProductDetailScreen';


type RootStackParamList = {
    LoginScreen: undefined;
    RegisterScreen: undefined;
    Drawer: undefined;
    ProductDetailScreen: { Product: Product };
}
const Stack = createStackNavigator<RootStackParamList>();

const MyStack = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

