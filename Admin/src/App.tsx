import { PermissionsAndroid, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import '../global.css';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from './screens/SplashScreen';
import MyStack from './navigations/MyStack';
import { Provider } from 'react-redux';
import store from './redux/store';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

async function requestStoragePermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        'title': 'Storage Permission',
        'message': 'This app needs access to your storage to read files.',
        'buttonNeutral': 'Ask Me Later',
        'buttonNegative': 'Cancel',
        'buttonPositive': 'OK'
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the storage");
      // Add your logic for accessing the storage here
    } else {
      console.log("Storage permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
}

// Call the function to request the permission
requestStoragePermission();

  // Splash screen timer
  useEffect(() => {

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <Provider store={store}>
      <NavigationContainer>
        {showSplash ? <SplashScreen /> : <MyStack />}
      </NavigationContainer>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
