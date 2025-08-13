// OrderScreen.tsx
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';


import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import ActiveOrders from '@Components/Tabs/Components/ActiveOrders';
import PastOrders from '@Components/Tabs/Components/PastOrders';
import { AppDispatch } from '@Redux/Store';
import { useDispatch, useSelector } from 'react-redux';
import { Order } from '@Utils/@types/Order';
import { fetchOrder } from '@Redux/Order/OrderSlice';
import Tabs from '@Components/Tabs/Tabs';

const OrderScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [loading,setLoading]=useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const OrderData: Order[] = useSelector((state: any) => state.Order.MyOrders ?? []);
 
  const fetchProductsData = async () => {
    setLoading(true);
        try {
          await dispatch(fetchOrder()); // if using Redux thunk
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.log('Error fetching Orders:', error);
        } finally {
          setLoading(false);
        }
  };

  useEffect(() => {
    console.log('Order Data:', OrderData);
    fetchProductsData();
  }, []);
   
  const activeOrders = OrderData.filter((order: Order) =>  order.OrderStatus !== 'Cancelled' && order?.ReceivedStatus !== 'Confirmed');
  const pastOrders = OrderData.filter((order: Order) => order.OrderStatus === 'Cancelled' || order?.ReceivedStatus === 'Confirmed');
  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="bg-primary py-5 px-5 shadow-md rounded-b-3xl">
        <View className="flex-row items-center pt-8 space-x-4">
          <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: 'TabBar' }] })} className='p-1'>
            <Icon name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text className="text-2xl font-semibold text-white">My Orders</Text>
        </View>
      </View>

      {/* Tabs */}
      <Tabs tabs={['Active Orders', 'Past Orders']}>
        <View>
          <ActiveOrders OrdersData={activeOrders} />
        </View>
        <View >
          <PastOrders OrdersData={pastOrders}/>
        </View>
      </Tabs>
    </View>
  );
};

export default OrderScreen;
