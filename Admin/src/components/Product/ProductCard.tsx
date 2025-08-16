// ProductCard.tsx
import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Product } from '../../@types/Product';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { API_URL } from '@env';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
}

const ProductCard = ({ product, onPress, onEdit, onDelete }: ProductCardProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mx-4 my-3"
    >
      {/* Top Row: Image + Details */}
      <View className="flex-row ">
        {/* Product Image */}
        <View className="w-[90px] h-[90px] rounded-xl overflow-hidden bg-gray-100 mr-4">
          {product.image ? (
            <Image
              source={typeof product.image === 'string' ? { uri: `${API_URL}/${product.image}` } : product.image}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <Text className="text-gray-400 text-xs">No Image</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View className="flex-1 justify-between">
          <Text className="text-xl font-semibold text-gray-900">{product.name}</Text>

          <View className="flex-row items-center justify-between mt-1">
            <Text className="text-md text-gray-700">Unit: {product.unit}</Text>
            <Text className="text-md font-semibold text-primary">
              ₹{(typeof product.price === 'number' ? product.price : 0).toFixed(2)}
            </Text>

          </View>

          {product.category ? (
            <Text className="text-md text-gray-500 mt-1">Category: {product.category}</Text>
          ) : null}


          <Text
            className={`text-sm font-semibold mt-1 ${
              product.isActive ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {product.isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-end gap-4 space-x-6 mt-4">
        <TouchableOpacity
          onPress={() => onEdit && onEdit(product)}
          className="flex-row items-center space-x-1"
        >
          <MaterialIcons name="edit" size={20} color="#2563EB" />

        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onDelete && onDelete(product._id)}
          className="flex-row items-center space-x-1"
        >
          <MaterialIcons name="delete" size={20} color="#DC2626" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;
