import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Order } from '@Utils/@types/Order';
import OrderCard from '@Components/Card/OrderCard';

type ActiveOrdersProps = {
  OrdersData: Order[];
  refreshing: boolean;
  onRefresh: () => void;
};
const ActiveOrders = ({
  OrdersData,
  onRefresh,
  refreshing,
}: ActiveOrdersProps) => {
  console.log('Active Orders Data:', OrdersData);
  return (
    <View className=" bg-gray-50 p-4">
      <FlatList
        data={OrdersData}
        style={{ marginBottom: 50 }}
        renderItem={({ item }) => <OrderCard Order={item} />}
        keyExtractor={item => item.OrderId.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500">No Active orders available</Text>
          </View>
        }
      />
    </View>
  );
};

export default ActiveOrders;

const styles = StyleSheet.create({});
