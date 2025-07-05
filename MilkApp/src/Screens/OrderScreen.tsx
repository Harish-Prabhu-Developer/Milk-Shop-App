// OrderScreen.tsx
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Tabs from '@Components/Tabs/Tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import ActiveOrders from '@Components/Tabs/Components/ActiveOrders';
import PastOrders from '@Components/Tabs/Components/PastOrders';
import { AppDispatch } from '@/Redux/Store';
import { useDispatch, useSelector } from 'react-redux';
import { Order } from '@/Utils/@types/Order';

const OrderScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const dispatch = useDispatch<AppDispatch>();
  const OrderData: Order[] = useSelector((state: any) => state.Order.MyOrders ?? []);
  console.log('Order Data:', OrderData);
  const activeOrders = OrderData.filter((order: Order) => order.OrderStatus !== 'Delivered' && order.OrderStatus !== 'Cancelled');
  const pastOrders = OrderData.filter((order: Order) => order.OrderStatus === 'Delivered' || order.OrderStatus === 'Cancelled');
  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="bg-primary py-5 px-5 shadow-md rounded-b-3xl">
        <View className="flex-row items-center pt-8 space-x-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
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
