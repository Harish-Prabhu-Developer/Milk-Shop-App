// CartScreen.tsx
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  RefreshControl,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AppDispatch, RootState } from '@Redux/Store';
import IncreaseButton from '@Components/Input/IncreaseButton';
import { Swipeable } from 'react-native-gesture-handler';
import CustomAlert from '@Components/Alert/CustomAert';
import { AddToCart, CartProduct, Items } from '@Utils/@types/Cart';
import { API_URL } from '@env';
import { fetchCart, removeFromCart, updateAddTOCart } from '@Redux/Cart/CartSlice';
import { CreateOrder } from '@Redux/Order/OrderSlice';

const CartScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const dispatch = useDispatch<AppDispatch>();
  const cartData: CartProduct = useSelector((state: RootState) => state.Cart.Carts);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);


  const fetchProductsData = async () => {
    setLoading(true);
        try {
          await dispatch(fetchCart()); // if using Redux thunk
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.log('Error fetching Carts:', error);
        } finally {
          setLoading(false);
        }
  };

  useEffect(() => {
    console.log('Cart Data:', cartData);
    console.log("API : ",API_URL);
    
    fetchProductsData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProductsData();
    setRefreshing(false);
  }, []);

  const DeleteAction = ({ onDelete }: { onDelete: () => void }) => (
    <View className="bg-red-500 justify-center items-center w-20 h-full rounded-md">
      <TouchableOpacity onPress={onDelete}>
        <Icon name="delete" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderCartItem = ({ item }: { item: Items }) => {
    const handleConfirmDelete = () => {
      setSelectedItemId(item.product._id); // Save which item is being deleted
      setIsAlertVisible(true);    // Show alert
    };

    const handleUpdatedCart=(Id:string,count:number)=>{
      console.log("Updated Cart",Id,count);
      
      const updatedCartItem:AddToCart =   {productId:Id, quantity:count}
       dispatch(updateAddTOCart(updatedCartItem));
    };


    return (
      <Swipeable
        renderLeftActions={() => <DeleteAction onDelete={handleConfirmDelete} />}
        renderRightActions={() => <DeleteAction onDelete={handleConfirmDelete} />}
        onSwipeableOpen={() => handleConfirmDelete()}
      >
        <View className="flex-row bg-white p-4 mb-4 rounded-2xl shadow-sm border border-gray-200">
          {/* Product Image */}
          <View className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100">
            <Image source={{ uri: `${API_URL}/${item.product.image}` }} className="w-full h-full" resizeMode="cover" />
          </View>

          {/* Info Section */}
          <View className="flex-1 pl-4 justify-between">
            <View>
              <Text className="text-lg font-semibold text-gray-800">{item.product.name}</Text>
              <Text className="text-sm text-gray-500 mt-1">{item.product.unit}</Text>
              <View className="flex-row mt-2">
                <Text className="text-gray-600 font-medium">Price:</Text>
                <Text className="text-gray-800 ml-2">₹{item.product.price}</Text>
              </View>
              <View className="flex-row mt-1">
                <Text className="text-gray-600 font-medium">Total:</Text>
                <Text className="text-gray-800 ml-2">₹{item.product.price * item.quantity}</Text>
              </View>
            </View>

            <View className="mt-3 mx-10">
                <IncreaseButton
                  OnCount={(Count) =>handleUpdatedCart(item.product._id,Count)}
                  initialCount={item.quantity}
                />


            </View>
          </View>
        </View>
      </Swipeable>
    );
  };


const handleCheckout = async () => {
 const res= await dispatch(CreateOrder());
 if (res.payload.msg==="Order created successfully") {
     Alert.alert('Order Placed', 'Your order has been placed successfully!', [
      { text: 'OK', onPress: () => navigation.navigate('TabBar') },
    ]);
 }
 
};

  return (
    <View className="flex-1 bg-gray-50">
      <CustomAlert
        visible={isAlertVisible}
        onCancel={() => {
          setIsAlertVisible(false);
          setSelectedItemId(null); // Reset
        }}
        onConfirm={() => {
          if (selectedItemId) {
            dispatch(removeFromCart(selectedItemId));
          }
          setIsAlertVisible(false);
          setSelectedItemId(null);
        }}
        title="Remove Item?"
        message="Are you sure you want to remove this item from your cart?"
        btnText="Remove"
        btnColor="bg-red-600"
      />

      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />

      {/* Header */}
      <View className="bg-primary py-12 px-5 shadow-lg">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center space-x-4">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={26} color="#fff" />
            </TouchableOpacity>
            <Text className="text-2xl text-white font-bold px-4">My Cart</Text>
          </View>
          <Text className="text-white text-base">{cartData?.items?.length ?? 0} item(s)</Text>
        </View>
      </View>

      {/* Cart List */}
      <View className="flex-1 px-4 mt-4">
        {cartData.items.length > 0 ? (
          <FlatList
            data={cartData.items}
            keyExtractor={(item, index) => item._id || index.toString()}
            renderItem={renderCartItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 140 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-zinc-600 text-base">Your cart is empty</Text>
          </View>
        )}
      </View>

      {/* Checkout Summary */}
      {(cartData?.items?.length ?? 0) > 0 && (
              <View className="absolute flex flex-row items-center justify-between bottom-10 left-0 right-0 px-5 py-4 bg-white border-t border-zinc-200 shadow-md">
                
                <View className=''>
                  <Text className="text-lg font-bold text-zinc-800">Total Price</Text>
                  <Text className="text-xl font-extrabold text-primary">₹{cartData.items.reduce((total, item) => total + item.product.price * item.quantity, 0)}</Text>
                </View>
                <TouchableOpacity
                  onPress={handleCheckout}
                  className="bg-primary py-4 rounded-2xl shadow-lg active:opacity-90"
                >
                  <Text className="text-center text-white font-semibold px-14 text-lg tracking-wide">
                    Proceed to Checkout 
                  </Text>
                </TouchableOpacity>
              </View>
      )}
    </View>
  );
};

export default CartScreen;
