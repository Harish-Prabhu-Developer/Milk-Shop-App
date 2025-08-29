import { View, Text, Image, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import IncreaseButton from '@Components/Input/IncreaseButton';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@Redux/Store';

import { API_URL } from '@env';
import { ProductWithQuantity } from '@Utils/@types/Products';
import { addToCart } from '@Redux/Cart/CartSlice';

const ProductDetailsScreen = () => {
  const route = useRoute();
  const product = route.params as ProductWithQuantity;

  const dispatch = useDispatch<AppDispatch>();
  const [quantity, setQuantity] = useState(product.quantity || 1); // Default quantity to 1 if not provided

  const handleAddToCart = () => {
    console.log(`${quantity} x ${product.name} added to cart`);
     const productToAdd = {
      productId: product._id,
      quantity: quantity
  };
  dispatch(addToCart(productToAdd));
  }
    useEffect(() => {
    console.log('API : ', API_URL);
  }, []);

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle={'dark-content'} />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} className="px-5 pt-10">

        {/* Product Image */}
        <View className="h-60 w-full bg-gray-100 rounded-3xl overflow-hidden justify-center items-center shadow-md mb-6">
          <Image source={{ uri: `${API_URL}/${product.image}` }} className="w-11/12 h-52" resizeMode="contain" />
        </View>

        {/* Product Title */}
        <Text className="text-2xl font-extrabold text-zinc-900 mb-1">{product.name}</Text>
        <Text className="text-lg font-bold text-zinc-800">{product.unit}</Text>

        {/* Price & Quantity */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-zinc-500 text-md">Price</Text>
            <Text className="text-lg font-bold text-zinc-800">₹{product.price}</Text>
          </View>

          <View className="items-end">
            <Text className="text-zinc-500 text-md mb-1">Quantity</Text>
            <IncreaseButton OnCount={(count) => setQuantity(count)} />
          </View>
        </View>

        {/* Description */}
        <View className="bg-zinc-50 rounded-2xl p-4 mb-6 shadow-sm">
          <Text className="text-zinc-800 font-semibold text-lg mb-2">Description</Text>
          <Text className="text-zinc-600 text-sm leading-relaxed text-justify">{product.description}</Text>
        </View>

        {/* Nutrition Info */}
        <View className="bg-zinc-50 rounded-2xl p-4 shadow-sm">
          <Text className="text-zinc-800 font-semibold text-lg mb-2">Nutritional Info</Text>
          {product.nutrition.split(',').map((item, index) => {
            const [label, value] = item.split(':');
            return (
              <View key={index} className="flex-row mb-1">
                <Text className="text-sm font-bold text-zinc-700 w-28" >
                  {label.trim().charAt(0).toUpperCase() + label.trim().slice(1)}:
                </Text>
                <Text className="text-sm text-zinc-600">{value?.trim()}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Sticky Add to Cart */}
      <View className="absolute flex flex-row items-center justify-between bottom-10 left-0 right-0 px-5 py-4 bg-white border-t border-zinc-200 shadow-md">
        
        <View className=''>
          <Text className="text-lg font-bold text-zinc-800">Total Price</Text>
          <Text className="text-xl font-extrabold text-primary">₹{(product.price * quantity).toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          onPress={handleAddToCart}
          className="bg-primary py-4 rounded-2xl shadow-lg active:opacity-90"
        >
          <Text className="text-center text-white font-semibold px-14 text-lg tracking-wide">
            Add to Cart 
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetailsScreen;
