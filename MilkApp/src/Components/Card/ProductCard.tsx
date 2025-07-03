// ProductCard.tsx
import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

interface ProductCardProps {
  name: string;
  price: number;
  image: any;
  onAddToCart: (quantity: number) => void;
}

const ProductCard = ({ name, price, image, onAddToCart }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);

  const increase = () => setQuantity(prev => prev + 1);
  const decrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <View className="bg-white rounded-2xl shadow-2xl w-[170px] mx-1 my-2 border border-primary">
      {/* Product Image */}
      <View className="h-32 bg-blue-50 rounded-t-2xl overflow-hidden">
        <Image source={image} className="w-full h-full" resizeMode="cover" />
      </View>

      {/* Content */}
      <View className="px-3 py-2">
        <Text numberOfLines={1} className="text-base font-semibold text-gray-800">
          {name}
        </Text>
        <Text className="text-sm text-gray-600 mt-1">₹{price.toFixed(2)}</Text>

        {/* Quantity Selector */}
        <View className="flex-row items-center justify-center gap-6 border border-gray-200 rounded-lg p-2 mt-3">
          <TouchableOpacity
            onPress={decrease}
            className="bg-gray-200 rounded-full px-2"
          >
            <Text className="text-lg font-semibold">−</Text>
          </TouchableOpacity>

          <Text className="text-base font-medium">{quantity}</Text>

          <TouchableOpacity
            onPress={increase}
            className="bg-gray-200 rounded-full px-2"
          >
            <Text className="text-lg font-semibold">+</Text>
          </TouchableOpacity>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity
          onPress={() => onAddToCart(quantity)}
          className="mt-3 bg-blue-600 rounded-xl py-2"
        >
          <Text className="text-white text-center text-sm font-semibold">
            Add {quantity} to Cart
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductCard;
