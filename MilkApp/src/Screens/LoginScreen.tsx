// LoginScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicatorComponent,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import CustomInput from '@Utils/CustomInput'; // import your CustomInput
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../Redux/Store';
import { login } from '../Redux/Auth/authSlice';
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passError, setPassError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigation = useNavigation<StackNavigationProp<any>>(); // Assuming you have set up navigation
  const dispatch=useDispatch<AppDispatch>();
  const {loading,error}=useSelector((state:RootState)=>state.auth)
  // Animations
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const formOpacity = useSharedValue(0);

  useEffect(() => {
    logoScale.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });

    logoOpacity.value = withTiming(1, {
      duration: 1200,
      easing: Easing.out(Easing.exp),
    });

    formOpacity.value = withTiming(1, {
      duration: 1400,
      easing: Easing.out(Easing.exp),
    });
  }, []);

  useEffect(() => {
    const loadSavedCredentials = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('rememberedEmail');
        const savedPassword = await AsyncStorage.getItem('rememberedPassword');

        if (savedEmail && savedPassword) {
          setEmail(savedEmail);
          setPassword(savedPassword);
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Error loading saved credentials', error);
      }
    };

    loadSavedCredentials();
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoScale.value }],
      opacity: logoOpacity.value,
    };
  });

  const formAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: formOpacity.value,
    };
  });

  // ValidateEmail Values
  const validateEmail = (email: string) => {
    const EMAILPATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return EMAILPATTERN.test(email);
  };

  // ValidatePassword Values
  const validatePass = (password: string) => password.length >= 8;

  // Checking Login Validate

  const handleLogin = async () => {
    let valid = true;

    if (!email) {
      setEmailError('Email is required.');
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Invalid email address.');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPassError('Password is required.');
      valid = false;
    } else if (!validatePass(password)) {
      setPassError('Password must be at least 8 characters.');
      valid = false;
    } else {
      setPassError('');
    }

    if (valid) {
      console.log('Login Data:', { email, password, rememberMe });
      const credentials: { email: string; password: string } = {
        email: email,
        password: password,
      };
      console.log('Logging in with', credentials);
      const res= await dispatch(login(credentials)).unwrap();
      console.log("Login Response:", res.msg);
      if (res.msg ==='Login successful') {
       navigation.navigate('TabBar'); // Navigate to TabBar after login 
      }
       
    }


    try {
      if (rememberMe) {
        await AsyncStorage.setItem('rememberedEmail', email);
        await AsyncStorage.setItem('rememberedPassword', password);
      } else {
        await AsyncStorage.removeItem('rememberedEmail');
        await AsyncStorage.removeItem('rememberedPassword');
      }
    } catch (error) {
      console.error('Error saving credentials', error);
    }
  };


    if (loading) {
      return(
           <View className='flex-1 items-center bg-black/45  justify-center'>
              <ActivityIndicator size="large" color={'#3D8BFD'}  />
              <Text className='text-white text-lg font-bold my-1'>Loading...</Text>
          </View>
        
      );
    };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          className="flex-1 justify-center px-6 py-4"
          style={{ paddingTop: 80, paddingBottom: 40, paddingHorizontal: 24 }}
        >
          <StatusBar barStyle={'dark-content'} />
          {/* App Logo with Animation */}
          <Animated.View
            style={logoAnimatedStyle}
            className="items-center mb-6"
          >
            <Image
              source={require('@assets/image.png')}
              style={{ width: 160, height: 160, borderRadius: 50 }}
              resizeMode="contain"
            />
            <Text className="text-primary text-3xl font-bold mt-2">
              Welcome Back
            </Text>
            <Text className="text-gray-500 text-base mt-1">
              Login to continue
            </Text>
          </Animated.View>

          {/* Form with fade-in */}
          <Animated.View style={formAnimatedStyle}>
            {/* email Field */}
            <View className="mb-4">
              <CustomInput
                type="email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                iconColor="#3D8BFD"
                cursorColor="#3D8BFD"
                iconSize={15}
                placeholderTextColor="#A0AEC0"
              />
              {emailError ? (
                <Text className="text-red-600 text-md text-right font-semibold mt-2">
                  {emailError}
                </Text>
              ) : null}
            </View>

            {/* Password Field */}
            <View className="mb-4">
              <CustomInput
                type="password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                iconColor="#3D8BFD"
                cursorColor="#3D8BFD"
                placeholderTextColor="#A0AEC0"
                eyeiconColor="#3D8BFD"
                eyeiconSize={16}
              />
              {passError ? (
                <Text className="text-red-600 text-md text-right font-semibold mt-2">
                  {passError}
                </Text>
              ) : null}
            </View>
            <View className="flex-row justify-between items-center w-full my-4">
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => setRememberMe(!rememberMe)}
              >
                <FontAwesome
                  name={rememberMe ? 'check-square' : 'square-o'}
                  size={20}
                  color="#3D8BFD"
                />
                <Text className="ml-2 font-semibold text-md text-gray-500">
                  Remember me
                </Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text className="text-right underline text-md text-gray-500 font-semibold">
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View>
            {error ? (
                <Text className="text-red-600 text-md text-center font-semibold my-4">
                  {error}
                </Text>
              ) : null}
            {/* Login Button */}
            <TouchableOpacity
              className="bg-primary rounded-xl py-4 mb-8"
              onPress={handleLogin}
            >
              <Text className="text-white text-center text-lg font-semibold">
                Login
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
