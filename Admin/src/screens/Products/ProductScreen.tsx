// ProductScreen.tsx
import { FlatList, Modal, Text, ToastAndroid, View } from 'react-native';
import React, { useState } from 'react';
import Header from '../../components/Header';
import FloatingButton from '../../components/FloatingButton';
import ProductForm from '../../components/Product/ProductForm';
import ProductCard from '../../components/Product/ProductCard';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { Product } from '../../@types/Product';
import { addProduct, removeProduct, updateProduct } from '../../redux/slices/productSlice';

const ProductScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const navigation = useNavigation<StackNavigationProp<any>>();
  const dispatch = useDispatch<AppDispatch>();
  const products: Product[] = useSelector((state: any) => state.product.products);

  // ✅ Add Product Handler
  const handleAddProduct = async (product: Product) => {
    try {
      const response = await dispatch(addProduct(product));
      if (response.payload) {
        ToastAndroid.show('Product Added', ToastAndroid.SHORT);
      }
    } catch (error: any) {
      ToastAndroid.show(`${error.message}`, ToastAndroid.SHORT);
    }
    setModalVisible(false);
  };

  // ✅ Delete Product Handler
  const handleDeleteProduct = async (productId: string) => {
    try {
      const res = await dispatch(removeProduct(productId));
      if (res.type === 'products/removeProduct') {
        ToastAndroid.show('Product Deleted', ToastAndroid.SHORT);
      }
    } catch (error: any) {
      ToastAndroid.show(`${error.message}`, ToastAndroid.SHORT);
    }
  };

  // ✅ Edit Product Handler
  const handleEditProduct = async (product: Product) => {
    try {
      const res = await dispatch(updateProduct(product));
      if (res.type === 'products/updateProduct') {
        ToastAndroid.show('Product Updated', ToastAndroid.SHORT);
      }
    } catch (error: any) {
      ToastAndroid.show(`${error.message}`, ToastAndroid.SHORT);
    }
    setEditingProduct(null);
    setModalVisible(false);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <Header title="Products" />

      {/* Product List */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetailScreen', { Product: item })}
            onEdit={(product) => {
              setEditingProduct(product);
              setModalVisible(true);
            }}
            onDelete={(id) => handleDeleteProduct(id)}
          />
        )}
        ListEmptyComponent={
          <View className="items-center mt-20">
            <Text className="text-gray-500">No products available.</Text>
          </View>
        }
      />

      {/* Floating Button */}
      <FloatingButton onPress={() => {
        setEditingProduct(null); // reset form
        setModalVisible(true);
      }} />

      {/* Modal for Add/Edit Product */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 bg-black/40 justify-end">
          <View className="flex-1 bg-white p-4">
            <ProductForm
              initialValues={editingProduct===null ? undefined : editingProduct}
              onClose={() => {
                setModalVisible(false);
                setEditingProduct(null);
              }}
              onSubmit={(product) => {
                editingProduct
                  ? handleEditProduct(product)
                  : handleAddProduct(product);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProductScreen;
