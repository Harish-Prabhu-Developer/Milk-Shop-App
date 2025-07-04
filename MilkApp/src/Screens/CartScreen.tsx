import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AppDispatch } from '@Redux/Store';
import { CartProduct } from '@Utils/@types/Products';
import { Image } from 'react-native';
import IncreaseButton from '@Components/Input/IncreaseButton';

const CartScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const dispatch = useDispatch<AppDispatch>();
  const cartData: CartProduct[] = useSelector((state: any) => state.Cart.Carts);
  const [Quantity, setQuantity] = useState(1); // Default quantity to 1
  const totalAmount = cartData.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const renderCartItem = ({ item }: { item: CartProduct }) => (
    <View className="bg-white rounded-2xl border border-primary shadow-black px-4 py-4 mb-4 shadow-sm flex-row items-center justify-between">
       <View className="w-2/4 h-32 bg-blue-50 rounded-2xl overflow-hidden">
         <Image source={item.image} className="w-full h-full m-2" resizeMode="cover" />
       </View>
      <View className="items-start w-2/4 px-4">
        <Text className="text-lg font-bold text-black">{item.name}</Text>
        <View className='flex-row items-start justify-start w-full mt-2'>
          <Text className='font-bold '>Price : </Text>
          <Text>₹{item.price}</Text>
        </View>
         <View className='flex-row items-start justify-start w-full mt-2'>
          <Text className='font-bold '>Unit : </Text>
          <Text>{item.unit}</Text>
        </View>
        <View className='flex-row items-start justify-start w-full mt-2'>
          <Text className='font-bold '>Total Price : </Text>
          <Text>{item.quantity*item.price}</Text>
        </View>
        <View className='mt-2 flex items-center'>
          <IncreaseButton OnCount={(Count) => setQuantity(Count)} initialCount={item.quantity} />
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View className="bg-primary py-12 px-4 rounded-b-3xl shadow-md">
        <View className='flex-row justify-between items-center'>
            <View className="flex-row justify-between gap-6 items-center">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={26} color="#fff" />
            </TouchableOpacity>
            <Text className="text-white text-2xl font-semibold">My Cart</Text>
        </View>
          <Text className="text-white text-lg">{cartData.length} Items</Text>
        </View>
      </View>

      {/* Cart Items */}
      <View className="flex-1 px-4 mt-4">
        {cartData.length > 0 ? (
          <FlatList
            data={cartData}
            keyExtractor={(item) => item.id}
            renderItem={renderCartItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-zinc-600 text-base">Your cart is empty</Text>
          </View>
        )}
      </View>

      {/* Checkout Bar */}
      {cartData.length > 0 && (
        <View className="absolute bottom-0 left-0 right-0 bg-white px-6 py-4 rounded-t-3xl shadow-md">
          <View className="flex-row justify-between mb-3">
            <Text className="text-lg text-zinc-800 font-semibold">Total</Text>
            <Text className="text-lg text-primary font-bold">₹{totalAmount.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            className="bg-primary py-3 rounded-2xl items-center"
            onPress={() => navigation.navigate('CheckoutScreen')} // Modify as needed
          >
            <Text className="text-white text-base font-semibold">Check Out</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CartScreen;
