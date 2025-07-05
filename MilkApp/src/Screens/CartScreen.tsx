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
import { AppDispatch } from '@Redux/Store';
import { CartProduct } from '@Utils/@types/Products';
import IncreaseButton from '@Components/Input/IncreaseButton';
import { Swipeable } from 'react-native-gesture-handler';
import { clearCart, EditOnCart, removeFromCart } from '@Redux/Cart/CartSlice';
import CustomAlert from '@Components/Alert/CustomAert';
import { addToMyOrders } from '@Redux/Order/OrderSlice';
import { Order, OrderProduct } from '@/Utils/@types/Order';

const CartScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const dispatch = useDispatch<AppDispatch>();
  const cartData: CartProduct[] = useSelector((state: any) => state.Cart.Carts);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const totalAmount = cartData.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const fetchProductsData = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  useEffect(() => {
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

  const renderCartItem = ({ item }: { item: CartProduct }) => {
    const handleConfirmDelete = () => {
      setSelectedItemId(item.id); // Save which item is being deleted
      setIsAlertVisible(true);    // Show alert
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
            <Image source={item.image} className="w-full h-full" resizeMode="cover" />
          </View>

          {/* Info Section */}
          <View className="flex-1 pl-4 justify-between">
            <View>
              <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
              <Text className="text-sm text-gray-500 mt-1">{item.unit}</Text>
              <View className="flex-row mt-2">
                <Text className="text-gray-600 font-medium">Price:</Text>
                <Text className="text-gray-800 ml-2">₹{item.price}</Text>
              </View>
              <View className="flex-row mt-1">
                <Text className="text-gray-600 font-medium">Total:</Text>
                <Text className="text-gray-800 ml-2">₹{item.price * item.quantity}</Text>
              </View>
            </View>

            <View className="mt-3 mx-10">
                <IncreaseButton
                  OnCount={(Count) => dispatch(EditOnCart({ id: item.id, quantity: Count }))}
                  initialCount={item.quantity}
                />


            </View>
          </View>
        </View>
      </Swipeable>
    );
  };


const handleCheckout = async () => {
  // Map cart items to OrderProduct structure
  const productData: OrderProduct[] = cartData.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    total: item.price * item.quantity,
    image: item.image,
    unit: item.unit,
    description: item.description
  }));

  // Generate order details
  const orderDetails: Order = {
    id: `ORD${Date.now()}`, // Temporary ID, replace with actual ID from backend
    ProductData: productData,
    UserId: 'user123', // Replace with actual user ID from auth
    UserName: 'John Doe', // Replace with actual user name
    OrderId: `ORD${Date.now()}${"John Doe"}${Math.floor(Math.random() * 1000)}`, // Unique Order ID
    OrderDate: new Date().toISOString(),
    TotalAmount: totalAmount,
    OrderStatus: 'Delivered',
    PaymentStatus: 'Failed',
    DeliveryStatus: 'Out for Delivery'
  };

   const res =await dispatch(addToMyOrders(orderDetails));
  if (res.type === 'Order/addToMyOrders') {
    Alert.alert('Order Placed', 'Your order has been placed successfully!', [
      { text: 'OK', onPress: () => navigation.navigate('TabBar') },
    ]);
    // Clear cart after successful order placement
      dispatch(clearCart());
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
          <Text className="text-white text-base">{cartData.length} item(s)</Text>
        </View>
      </View>

      {/* Cart List */}
      <View className="flex-1 px-4 mt-4">
        {cartData.length > 0 ? (
          <FlatList
            data={cartData}
            keyExtractor={(item, index) => item.id || index.toString()}
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
      {cartData.length > 0 && (
              <View className="absolute flex flex-row items-center justify-between bottom-10 left-0 right-0 px-5 py-4 bg-white border-t border-zinc-200 shadow-md">
                
                <View className=''>
                  <Text className="text-lg font-bold text-zinc-800">Total Price</Text>
                  <Text className="text-xl font-extrabold text-primary">₹{totalAmount.toFixed(2)}</Text>
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
