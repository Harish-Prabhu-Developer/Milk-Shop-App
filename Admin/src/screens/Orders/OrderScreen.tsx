import { View } from 'react-native';
import React from 'react';
import Header from '../../components/Header';
import { Text } from 'react-native';
import { FlatList } from 'react-native';
import OrderCard from '../../components/Order/OrderCard';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { Order } from '../../@types/Order';

const OrderScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const OrdersData: Order[] = useSelector(
    (state: RootState) => state.order.orders,
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <Header title={'Orders'} />
      {/* Order List */}
      {/* This will be replaced with the actual order list component */}

      <FlatList
        data={OrdersData} // Placeholder data
        keyExtractor={(item, index) => item.id || index.toString()}
        className="p-4"
        renderItem={({ item }) => <OrderCard Order={item} />}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500">No orders available</Text>
          </View>
        }
      />
    </View>
  );
};

export default OrderScreen;
