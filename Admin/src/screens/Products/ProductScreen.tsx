// ProductScreen.tsx
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Header from '../../components/Header';
import FloatingButton from '../../components/FloatingButton';
import ProductForm from '../../components/Product/ProductForm';
import ProductCard from '../../components/Product/ProductCard';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { Product } from '../../@types/Product';
import { fetchProducts, newProduct } from '../../redux/slices/productSlice';
import { RefreshControl } from 'react-native';

const ProductScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const dispatch = useDispatch<AppDispatch>();
  const products: Product[] = useSelector(
    (state: RootState) => state.product.products,
  );

  const fetchProductsData = async () => {
    try {
      setLoading(true);
      await dispatch(fetchProducts());
      await new Promise(resolve => setTimeout(resolve, 1000)); // simulate delay
    } catch (error) {
      console.log('Error fetching Orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsData();
    console.log('Products : ', products);
  }, []);

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProductsData();
    setRefreshing(false);
  }, []);

  // ✅ Add Product Handler
  const handleAddProduct = async (product: Product) => {
    console.log('Product Added:', product);

    try {
          const formData = new FormData();

    // Append fields
    formData.append('name', product.name);
    formData.append('price', product.price.toString());
    formData.append('unit', product.unit);
    formData.append('description', product.description || '');
    formData.append('nutrition', product.nutrition || '');
    formData.append('category', product.category || '');
    formData.append('isActive', product.isActive ? 'true' : 'false');

    // Append image (if selected)
    if (product.image && product.image.startsWith('file://')) {
      formData.append('image', {
        uri: product.image,
        type: 'image/png', // adjust if needed
        name: 'product.png',
      } as any);
    }
    console.log('Form Data:', formData);
      // If you use Redux Toolkit (RTK Query or Thunks)
      const response = await dispatch(newProduct(formData));
      console.log("Response:", response);
      
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
    console.log('Product Deleted : ', productId);

    // try {
    //   const res = await dispatch(removeProduct(productId));
    //   if (res.type === 'products/removeProduct') {
    //     ToastAndroid.show('Product Deleted', ToastAndroid.SHORT);
    //   }
    // } catch (error: any) {
    //   ToastAndroid.show(`${error.message}`, ToastAndroid.SHORT);
    // }
  };

  // ✅ Edit Product Handler
  const handleEditProduct = async (product: Product) => {
    console.log('Product Updated : ', product);

    // try {
    //   const res = await dispatch(updateProduct(product));
    //   if (res.type === 'products/updateProduct') {
    //     ToastAndroid.show('Product Updated', ToastAndroid.SHORT);
    //   }
    // } catch (error: any) {
    //   ToastAndroid.show(`${error.message}`, ToastAndroid.SHORT);
    // }
    setEditingProduct(null);
    setModalVisible(false);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <Header title="Products" />

      {/* Product List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4B5563" />
          <Text className="mt-2 text-gray-700">Loading products...</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() =>
                navigation.navigate('ProductDetailScreen', { Product: item })
              }
              onEdit={product => {
                setEditingProduct(product);
                setModalVisible(true);
              }}
              onDelete={id => handleDeleteProduct(id)}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View className="items-center">
              <Text className="text-gray-500">No products available.</Text>
            </View>
          }
        />
      )}

      {/* Floating Button */}
      <FloatingButton
        onPress={() => {
          setEditingProduct(null); // reset form
          setModalVisible(true);
        }}
      />

      {/* Modal for Add/Edit Product */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 bg-black/40 justify-end">
          <View className="flex-1 bg-white p-4">
            <ProductForm
              initialValues={
                editingProduct === null ? undefined : editingProduct
              }
              onClose={() => {
                setModalVisible(false);
                setEditingProduct(null);
              }}
              onSubmit={product => {
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
