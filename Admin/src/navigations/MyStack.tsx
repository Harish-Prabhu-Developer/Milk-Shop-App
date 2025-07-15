import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AppDrawer from './AppDrawer';
import { useState } from 'react';


type RootStackParamList = {
    LoginScreen: undefined;
    RegisterScreen: undefined;
    Drawer: undefined
}
const Stack = createStackNavigator<RootStackParamList>();

const MyStack = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}
            initialRouteName={isLoggedIn ? "Drawer" : "LoginScreen"}>
        <Stack.Screen name='LoginScreen' component={LoginScreen} />
        <Stack.Screen name='RegisterScreen' component={RegisterScreen} />
        <Stack.Screen name='Drawer' component={AppDrawer} />
    </Stack.Navigator>
  )
}

export default MyStack

