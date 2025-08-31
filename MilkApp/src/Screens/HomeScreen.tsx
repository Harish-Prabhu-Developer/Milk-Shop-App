import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StatusBar,
  FlatList,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  RefreshControl,
  Alert,
  BackHandler,
} from 'react-native';
import ProductCard from '@Components/Card/ProductCard';
import HeaderSection from '@Components/Header/HeaderSection';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@Redux/Store';
import { StackNavigationProp } from '@react-navigation/stack';

import { fetchProducts } from '@Redux/Product/ProductSlice';
import { Product } from '@Utils/@types/Products';
import { AddToCart, CartProduct } from '@Utils/@types/Cart';
import { addToCart } from '@Redux/Cart/CartSlice';
import { fetchProfile } from '@Redux/Auth/authSlice';

const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const dispatch = useDispatch<AppDispatch>();
  const [SearchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [quantities, setQuantities] = useState<{ [productId: string]: number }>({});


const productsData: Product[] = useSelector(
  (state: RootState) => state.product.products || []
);



    const handleBackPress = () => {
    Alert.alert(
      'Exit App',
      'Are you sure you want to exit?',
      [
        { text: 'Cancel', onPress: () => null, style: 'cancel' },
        { text: 'Exit', onPress: () => BackHandler.exitApp() },
      ]
    );
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => {
        backHandler.remove();
      };
    }, [])
  );

  // Simulated data fetch
  const fetchProductsData = async () => {
    setLoading(true);
    try {
      await dispatch(fetchProducts()); // if using Redux thunk
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.log('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchProductsData();
    dispatch(fetchProfile());
  }, []);
  // This effect can be used to fetch products data when the component mounts
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProductsData();
    setRefreshing(false);
  }, []);

  const handleAddToCart = (productId: string, itemName: string, qty: number) => {
    setQuantities((prev) => ({ ...prev, quantity: qty }));
    const productToAdd: AddToCart = {
      productId: productId,
      quantity: qty,
    };
    dispatch(addToCart(productToAdd));
    console.log(`${qty} x ${itemName} added to cart`);
  };

const filteredProducts = productsData.filter((item) =>
    item.name.toLowerCase().includes(SearchQuery.toLowerCase())
    
  );

  return (
    <View className="flex-1 bg-gray-50">


      {/* Header with Search */}
      <KeyboardAvoidingView behavior="padding">
        <HeaderSection
          SearchBar={true}
          onSearch={(query) => setSearchQuery(query)}
        />
      </KeyboardAvoidingView>

      <View className="px-4 my-3">
        <Text className="text-xl font-bold text-gray-800">Our Products</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4B5563" />
          <Text className="mt-2 text-gray-700">Loading products...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item._id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 100 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={() => (
            <Text className="text-center text-black">No products available</Text>
          )}
          renderItem={({ item }) => {
            const currentQty = quantities[item._id] ?? 1;

            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ProductDetailsScreen', {
                    _id: item._id,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    unit: item.unit,
                    description: item.description,
                    nutrition: item.nutrition,
                    quantity: currentQty,
                  })
                }
              >
                <ProductCard
                  name={item.name}
                  price={item.price}
                  image={item.image}
                  quantity={currentQty}
                  unit={item.unit}
                  onAddToCart={(qty) => handleAddToCart(item._id, item.name, qty)}
                />
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

export default HomeScreen;
