// ProductCard.tsx
import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import IncreaseButton from '../Input/IncreaseButton';

interface ProductCardProps {
  name: string;
  price: number;
  image: any;
  unit: string;
  description?: string;
  nutrition?: string;
  //send ProductDetailsScreen into increase or decrease value
  quantity?: number;
  onAddToCart: (qty: number) => void;
  onPress?: () => void;
}

const ProductCard = ({ name, price, image,quantity,unit,description,nutrition, onAddToCart }: ProductCardProps) => {
  const [Quantity, setQuantity] = useState(quantity || 1); // Default quantity to 1 if not provided


  return (
    <View className="bg-white rounded-2xl shadow-2xl w-[170px] mx-1 my-2 border border-primary">
      {/* Product Image */}
      <View className="h-32 bg-blue-50 rounded-t-2xl overflow-hidden">
        <Image source={image} className="w-full h-full m-2" resizeMode="cover" />
      </View>

      {/* Content */}
      <View className="px-3 py-2">
        <Text numberOfLines={1} className="text-base font-semibold text-gray-800">
          {name}
        </Text>
        <View className='flex-row-reverse items-center justify-between mt-1'>
            <Text className="text-md text-gray-600 mt-1">₹{price.toFixed(2)}</Text>
            <Text className="text-md text-gray-500 mt-1">{unit}</Text>
        </View>
        {/* Quantity Selector */}
        <View className='mt-2 flex items-center'>
          <IncreaseButton OnCount={(Count) => setQuantity(Count)} initialCount={Quantity} />
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity
          onPress={() => onAddToCart(Quantity)}
          className="mt-3 bg-blue-600 rounded-xl py-2"
        >
          <Text className="text-white text-center text-sm font-semibold" >
            Add {Quantity} to Cart • ₹{(price * Quantity).toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductCard;
