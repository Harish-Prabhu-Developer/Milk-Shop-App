// HomeScreen.tsx
import React, { useEffect } from 'react';
import {
  View,
  StatusBar,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import ProductCard from '@Components/Card/ProductCard';
import HeaderSection from '@Components/Header/HeaderSection';
import { KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppDispatch } from '@/Redux/Store';
import { useDispatch, useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
type Product = {
    id: string;
    name: string;
    price: number;
    image: any;
  };
const products = [
  {
    id: '1',
    name: 'Full Cream Milk',
    price: 28.5,
    image: require('@assets/image.png'),
  },
  {
    id: '2',
    name: 'Toned Milk',
    price: 25.0,
    image: require('@assets/image.png'),
  },
  {
    id: '3',
    name: 'Skimmed Milk',
    price: 23.0,
    image: require('@assets/image.png'),
  },
  { id: '4', name: 'Curd', price: 35.0, image: require('@assets/image.png') },
  { id: '5', name: 'Paneer', price: 85.0, image: require('@assets/image.png') },
  { id: '6', name: 'Ghee', price: 450.0, image: require('@assets/image.png') },
  { id: '7', name: 'Butter', price: 75.0, image: require('@assets/image.png') },
];

const HomeScreen = () => {
const handleAddToCart = (itemName: string, qty: number) => {
  console.log(`${qty} x ${itemName} added to cart`);
};
  const navigation = useNavigation<StackNavigationProp<any>>();
  const dispatch =useDispatch<AppDispatch>();
  const ProductsData:Product[]=useSelector((state:any) => state.product.products);
  useEffect(() => {
    // Fetch products from the Redux store or API if needed
    // dispatch(fetchProducts());
  }, [dispatch]);
  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />

      {/* Header Section */}
      <KeyboardAvoidingView behavior="padding" className="sm:pt-safe-or-8">
        <HeaderSection
          SearchBar={true}
          onSearch={query => console.log(query)}
        />
      </KeyboardAvoidingView>

      {/* Title */}
      <View className="px-4 my-3">
        <Text className="text-xl font-bold text-gray-800">Our Products</Text>
      </View>

      {/* Product Grid */}
      <FlatList
        data={ProductsData.length > 0 ? ProductsData : products}
        keyExtractor={(item, index) => item.id || index.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 16 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        ListEmptyComponent={() => (
          <Text className="text-center text-black">No products available</Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ProductDetailsScreen', {
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                unit: '500ml',
                description: 'Fresh and pure dairy milk perfect for daily use.',
                nutrition:
                  'Energy: 70kcal | Fat: 4g | Protein: 3.2g | Calcium: 120mg',
              })
            }
          >
            <ProductCard
                name={item.name}
                price={item.price}
                image={item.image}
                onAddToCart={(qty) => handleAddToCart(item.name, qty)}
              />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default HomeScreen;
