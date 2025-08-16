import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  ToastAndroid,
} from 'react-native';
import React, { useState } from 'react';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Product } from '../../@types/Product';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ProductForm from '../../components/Product/ProductForm';
import { AppDispatch } from '../../redux/store';
import { useDispatch } from 'react-redux';
import { API_URL } from '@env';
import { deleteProduct, updateProduct } from '../../redux/slices/productSlice';


const ProductDetailScreen = () => {
  const route = useRoute<RouteProp<any>>();
  const dispatch = useDispatch<AppDispatch>();
  const product: Product = route.params?.Product;

  const navigation = useNavigation();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const handleEdit = () => setEditModalVisible(true);

  const handleDeleteProduct = async () => {
    try {
      const res = await dispatch(deleteProduct(product._id));
      if (res.payload.msg === 'Product deleted successfully') {
        ToastAndroid.show('Product Deleted', ToastAndroid.SHORT);
      }

    } catch (error: any) {
      ToastAndroid.show(`${error.message}`, ToastAndroid.SHORT);
    }
    navigation.goBack();
  };
  const handleEditProduct = async (PRODUCT: Product) => {
    try {
    const formData = new FormData();

    // Append fields

    formData.append('name', PRODUCT.name);
    formData.append('price', PRODUCT.price.toString());
    formData.append('unit', PRODUCT.unit);
    formData.append('description', PRODUCT.description || '');
    formData.append('nutrition', PRODUCT.nutrition || '');
    formData.append('category', PRODUCT.category || '');
    formData.append('isActive', PRODUCT.isActive ? 'true' : 'false');

    // Append image (if selected)
    if (PRODUCT.image && PRODUCT.image.startsWith('file://')) {
      formData.append('image', {
        uri: PRODUCT.image,
        type: 'image/png', // adjust if needed
        name: 'product.png',
      } as any);
    }
    const updatedProductData={
      id:PRODUCT._id,
      data:formData
    };
      const res = await dispatch(updateProduct(updatedProductData));
      if (res.payload.msg === 'Product updated successfully') {
        ToastAndroid.show('Product Updated', ToastAndroid.SHORT);
      }
      
    } catch (error: any) {
      ToastAndroid.show(`${error.message}`, ToastAndroid.SHORT);
    }
    navigation.goBack();
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
          onPress: handleDeleteProduct,
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
              onSubmit={(updatedProduct) =>handleEditProduct(updatedProduct)}
            />
          </View>
        </View>
      </Modal>

      {/* Main Screen */}
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-14 pb-4 bg-primary shadow">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white">
            Product Details
          </Text>
          <View className="w-6" />
        </View>

        {/* Content */}
        <ScrollView
          contentContainerStyle={{ paddingBottom: 120 }}
          className="px-6 py-6"
        >
          {/* Image Section */}
          <View className="items-center mb-6">
            <View className="w-44 h-44 rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
              {product?.image ? (
                <Image
                  source={
                    typeof product.image === 'string'
                      ? { uri: `${API_URL}/${product.image}` }
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
            <Text className="text-2xl font-bold text-gray-900 mt-4">
              {product?.name}
            </Text>
          </View>

          {/* Price & Unit */}
          <View className="flex-row justify-between px-4 py-3 rounded-xl mb-4 shadow-sm">
            <Text className="text-base text-gray-700 font-medium">
              Unit: <Text className="text-gray-900">{product?.unit}</Text>
            </Text>
            <Text className="text-base text-gray-700 font-medium">
              Price:{' '}
              <Text className="text-primary font-semibold">
                ₹{product?.price?.toFixed(2)}
              </Text>
            </Text>
          </View>

          {/* Category */}
          {product?.category && (
            <View className=" px-4 py-3 rounded-xl mb-4 shadow-sm">
              <Text className="text-base font-medium text-gray-700">
                Category:{' '}
                <Text className="text-gray-900">{product.category}</Text>
              </Text>
            </View>
          )}

          {/* Description */}
          {product?.description && (
            <View className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
              <Text className="text-lg font-semibold text-gray-900 mb-2">
                Description
              </Text>
              <Text className="text-gray-700 text-sm leading-relaxed">
                {product.description}
              </Text>
            </View>
          )}

          {/* Nutrition Info */}
          {product?.nutrition && (
            <View className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-4">
              <Text className="text-lg font-semibold text-gray-900 mb-2">
                Nutritional Info
              </Text>
              {product.nutrition.split(',').map((item, index) => {
                const [label, value] = item.split(':');
                return (
                  <View key={index} className="flex-row mb-1">
                    <Text className="text-sm font-medium text-gray-800 w-28">
                      {label?.trim().charAt(0).toUpperCase() +
                        label?.trim().slice(1)}
                      :
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {value?.trim()}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          {/* Active Status */}
          <View className="mt-2 items-end">
            <Text
              className={`text-sm font-bold px-4 py-1 rounded-full ${
                product?.isActive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-600'
              }`}
            >
              {product?.isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View className="absolute bottom-0 left-0 right-0 bg-white px-6 py-4 border-t border-gray-200 flex-row justify-between shadow-md">
          <TouchableOpacity
            onPress={handleEdit}
            className="flex-1 bg-primary py-3 mb-2 rounded-xl mr-2 items-center"
          >
            <Text className="text-white font-semibold text-md">Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDelete}
            className="flex-1 bg-red-500 py-3 mb-2 rounded-xl ml-2 items-center"
          >
            <Text className="text-white font-semibold text-md">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default ProductDetailScreen;
