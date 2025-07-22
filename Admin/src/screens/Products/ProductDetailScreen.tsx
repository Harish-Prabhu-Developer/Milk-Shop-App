// ProductDetailScreen.tsx
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import React, { useState } from 'react';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Product } from '../../@types/Product';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ProductForm from '../../components/Product/ProductForm';

const ProductDetailScreen = () => {
  const route = useRoute<RouteProp<any>>();
  const navigation = useNavigation();
  const product: Product = route.params?.Product;

  const [editModalVisible, setEditModalVisible] = useState(false);

  const handleEdit = () => {
    setEditModalVisible(true);
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete "${product?.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            console.log('Deleted:', product?.id);
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <>
      {/* Edit Modal */}
      <Modal visible={editModalVisible} animationType="slide">
        <View className="flex-1 bg-black/40 justify-end">
          <View className="flex-1 bg-white p-4">
            <ProductForm
              initialValues={product}
              onClose={() => setEditModalVisible(false)}
              onSubmit={Product => console.log('Product : ', Product)}
            />
          </View>
        </View>
      </Modal>

      {/* Main Screen */}
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-14 pb-4 bg-primary">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-white">
            Product Details
          </Text>
          <View className="w-6" />
        </View>

        {/* Content */}
        <ScrollView
          contentContainerStyle={{ paddingBottom: 120 }}
          className="px-6 py-6"
        >
          {/* Product Image */}
          <View className="items-center mb-6">
            <View className="w-44 h-44 rounded-2xl overflow-hidden bg-gray-100 shadow">
              {product?.image ? (
                <Image
                  source={
                    typeof product.image === 'string'
                      ? { uri: product.image }
                      : product.image
                  }
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="flex-1 items-center justify-center">
                  <Text className="text-gray-400">No Image</Text>
                </View>
              )}
            </View>
          </View>

          {/* Product Info */}
          <View className="space-y-5">
            <Text className="text-2xl font-bold text-center text-gray-900">
              {product?.name}
            </Text>

            <View className="flex-row justify-between px-1">
              <Text className="text-base text-gray-700">
                Unit:{' '}
                <Text className="font-semibold text-gray-800">
                  {product?.unit}
                </Text>
              </Text>
              <Text className="text-base text-gray-700">
                Price:{' '}
                <Text className="font-semibold text-primary">
                  ₹{product?.price.toFixed(2)}
                </Text>
              </Text>
            </View>

            {product?.category && (
              <Text className="text-base text-gray-600">
                Category:{' '}
                <Text className="font-medium text-gray-800">
                  {product.category}
                </Text>
              </Text>
            )}

            {product?.description && (
              <View>
                <Text className="text-sm text-gray-500 font-medium mb-1">
                  Description
                </Text>
                <Text className="text-base text-gray-800">
                  {product.description}
                </Text>
              </View>
            )}

            {product?.nutrition && (
              <View>
                <Text className="text-sm text-gray-500 font-medium mb-1">
                  Nutrition Info
                </Text>
                <Text className="text-base text-gray-800">
                  {product.nutrition}
                </Text>
              </View>
            )}

            <Text
              className={`text-sm font-bold mt-2 ${
                product?.isActive ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {product?.isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </ScrollView>

        {/* Bottom Action Buttons */}
        <View className="absolute bottom-0 left-0 right-0 bg-white px-6 py-4 border-t border-gray-200 flex-row justify-between">
          <TouchableOpacity
            onPress={handleEdit}
            className="flex-1 bg-blue-600 py-3 rounded-xl mr-2 items-center"
          >
            <Text className="text-white font-semibold text-base">Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDelete}
            className="flex-1 bg-red-500 py-3 rounded-xl ml-2 items-center"
          >
            <Text className="text-white font-semibold text-base">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default ProductDetailScreen;
