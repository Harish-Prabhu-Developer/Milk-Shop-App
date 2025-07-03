// ProductDetailsScreen.tsx
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
  nutrition: string;
  image: any;
}

const ProductDetailsScreen = () => {
  const route = useRoute();
  const product = route.params as Product;

  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    console.log(`${quantity} x ${product.name} added to cart`);
  };

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-10">
      {/* Product Image */}
      <View className="h-64 bg-gray-100 rounded-xl overflow-hidden mb-4">
        <Image source={product.image} className="w-full h-full" resizeMode="contain" />
      </View>

      {/* Product Name */}
      <Text className="text-2xl font-bold text-gray-800">{product.name}</Text>
      <Text className="text-lg text-gray-600 mt-1">₹{product.price.toFixed(2)} / {product.unit}</Text>

      {/* Quantity Selector */}
      <View className="flex-row items-center border border-gray-200 rounded-xl p-2 gap-4 mt-4">
        <TouchableOpacity
          className="bg-gray-200 px-3 py-1 rounded-full"
          onPress={() => setQuantity(Math.max(1, quantity - 1))}
        >
          <Text className="text-lg font-bold">-</Text>
        </TouchableOpacity>

        <Text className="text-lg font-semibold">{quantity}</Text>

        <TouchableOpacity
          className="bg-gray-200 px-3 py-1 rounded-full"
          onPress={() => setQuantity(quantity + 1)}
        >
          <Text className="text-lg font-bold">+</Text>
        </TouchableOpacity>
      </View>

      {/* Description */}
      <View className="mt-6">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Description</Text>
        <Text className="text-sm text-gray-700">{product.description}</Text>
      </View>

      {/* Nutrition Info */}
      <View className="mt-6">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Nutritional Info</Text>
        <Text className="text-sm text-gray-700">{product.nutrition}</Text>
      </View>

      {/* Add to Cart Button */}
      <TouchableOpacity
        className="mt-8 bg-blue-600 py-3 rounded-xl"
        onPress={handleAddToCart}
      >
        <Text className="text-white text-center text-base font-semibold">
          Add {quantity} to Cart
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProductDetailsScreen;
