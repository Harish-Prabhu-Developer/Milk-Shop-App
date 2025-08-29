import { StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@Redux/Store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { CartProduct } from '@Utils/@types/Cart';
import { fetchCart } from '@Redux/Cart/CartSlice';
import { fetchNotifications } from '@Redux/Auth/authSlice';
type HeaderSectionProps = {
    SearchBar?: boolean;
    onSearch?: (query: string) => void;
}


const HeaderSection: React.FC<HeaderSectionProps> = ({SearchBar, onSearch}) => {
    //search data and filter data
     const [searchQuery, setSearchQuery] = useState('');
     const navigation = useNavigation<StackNavigationProp<any>>();     
     const dispatch = useDispatch<AppDispatch>();
     const cartData: CartProduct = useSelector((state: RootState) => state.Cart.Carts);
     const notificationCount = useSelector((state: RootState) => state.auth.notificationCount);
     const [displayName, setDisplayName] = useState('Branch');
  useEffect(()=>{
    console.log("Test",cartData.items?.length ?? 0);
    
     const getName = async () => {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const decode=jwtDecode<any>(token);
          await dispatch(fetchCart());
          await dispatch(fetchNotifications());
          setDisplayName(decode.name);
        }else{
          setDisplayName('Branch');
          console.log("No token found");
          
        }
     }
     getName();
  },[setDisplayName])
  return (
          <View className="bg-primary px-4 py-[36px] rounded-b-3xl w-full">
            {/* Greeting and Icons */}
            
            <View className="flex-row justify-between items-center w-full">
              <View className="flex-col">
                <Text className="text-white text-xl  font-semibold">Hello, {displayName}!</Text>

                <Text className="text-white text-md">Welcome back to Dairy Drop</Text>
              </View>
              {/* Cart & Notification Icons */}
              <View className="flex-row space-x-6 gap-4">
                <TouchableOpacity className="relative bg-blue-800 p-2 rounded-lg"
                  onPress={() => navigation.navigate("CartScreen")}>
                  <Icon name="shopping-cart" size={20} color="#fff" />
                  {(cartData.items?.length ?? 0) > 0 && (<View className="w-2 h-2 bg-red-500 rounded-full absolute top-2 right-2" />)}
                </TouchableOpacity>
                <TouchableOpacity className="relative bg-blue-800 p-2 rounded-lg"
                  onPress={() => navigation.navigate("Notifications")}>
                  <Icon name="notifications" size={20} color="#fff" />
                  {notificationCount > 0 && (<View className="w-2 h-2 bg-red-500 rounded-full absolute top-2 right-2" />)}
                </TouchableOpacity>
              </View>
            </View>
    
            {/* Search Bar */}
            {
                SearchBar && (<View className="flex-row items-center bg-white rounded-xl mt-4 px-3 py-2 w-full">
              <Icon name="search" size={20} color="#888" />
              <TextInput
                placeholder="Search for Products"
                placeholderTextColor="#999"
                className="flex-1 px-2 text-black"
                value={searchQuery}
                onChangeText={(text) => {
                    setSearchQuery(text);
                    if (onSearch) {
                        onSearch(text);
                    }
                }}
              />
              <TouchableOpacity >
                <Icon name="tune" size={20} color="#3b82f6" />
              </TouchableOpacity>
            </View>)
            }
          </View>
  )
}

export default HeaderSection

const styles = StyleSheet.create({})