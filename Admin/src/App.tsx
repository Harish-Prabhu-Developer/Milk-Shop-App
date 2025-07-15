import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import "../global.css";
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from './screens/SplashScreen';
import MyStack from './navigations/MyStack';
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
  return (
     <NavigationContainer>
        {showSplash ? (
          <SplashScreen />
        ) : (
          <MyStack/>
        )}
      </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})