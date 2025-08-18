// OrderScreen.tsx
import {
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  FlatList,
  TextInput,
} from 'react-native';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import { AppDispatch, RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { Order } from '../../@types/Order';
import { fetchOrder } from '../../redux/slices/orderSlice';
import Tabs from '../../components/Order/Tab/Tabs';
import OrderCard from '../../components/Order/OrderCard';
import { Modal } from 'react-native';
import { formatDate, GetDay, GetTime } from '../../utils/CustomFunctions/DateFunctions';

const OrderScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [isloading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // filter state
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const OrderData: Order[] = useSelector(
    (state: RootState) => state.order.orders,
  );

  const fetchOrdersData = async () => {
    try {
      await dispatch(fetchOrder());
      await new Promise(resolve => setTimeout(resolve, 1000)); // simulate delay
    } catch (error) {
      console.log('Error fetching Orders:', error);
    }
  };

  useEffect(() => {
    fetchOrdersData();
  }, []);

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOrdersData();
    setRefreshing(false);
  }, []);

  // apply search + filter logic
  const filteredOrders = useMemo(() => {
    let data = [...OrderData];

// search filter
if (searchQuery) {
  const query = searchQuery.toLowerCase();

  data = data.filter(order =>
    // Order-level fields
    formatDate(order.OrderDate).toLowerCase().includes(query) ||
    GetTime(order.OrderDate).toLowerCase().includes(query) ||
    GetDay(order.OrderDate).toLowerCase().includes(query) ||
    order.Branch?.branchName?.toLowerCase().includes(query) ||
    order.Branch?.email?.toLowerCase().includes(query) ||
    order.Branch?.phone?.toLowerCase().includes(query) ||
    order.TotalAmount?.toString().toLowerCase().includes(query) ||

    // Product-level fields (check any product inside the order)
    order.ProductData?.some(product =>
      product.product?.category?.toLowerCase().includes(query) ||
      product.product?.name?.toLowerCase().includes(query) ||
      product.product?.price?.toString().toLowerCase().includes(query) ||
      product.product?.unit?.toLowerCase().includes(query) ||
      product.product?.nutrition?.toLowerCase().includes(query) ||
      product.product?.description?.toLowerCase().includes(query) ||
      product.quantity?.toString().toLowerCase().includes(query)
    )
  );
}


    // status filter
    if (selectedStatus) {
      data = data.filter(order => order.OrderStatus === selectedStatus);
    }

    // date filter example (Last 2 days)
    if (dateFilter === 'last7days') {
      const now = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);

      data = data.filter(order => {
        const createdAt = new Date(order.createdAt);
        return createdAt >= sevenDaysAgo && createdAt <= now;
      });
    }

    return data;
  }, [OrderData, searchQuery, selectedStatus, dateFilter]);

  const renderFlatList = (OrdersType: Order[], EmptyMSG: string) => {
    return (
      <>
        {isloading ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500">Loading...</Text>
          </View>
        ) : OrdersType.length <= 0 ? (
          <View className="justify-center items-center">
            <Text className="text-gray-500">{EmptyMSG}</Text>
          </View>
        ) : (
          <FlatList
            data={OrdersType}
            renderItem={({ item }) => <OrderCard Order={item} />}
            keyExtractor={item => item.OrderId.toString()}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />
      <Header title={'Orders'} />
      {/* search bar */}
      <View className="flex-row items-center border border-primary bg-white rounded-xl mx-4 my-4 px-3 py-2">
        <Icon name="search" size={20} color="#888" />
        <TextInput
          placeholder="Search for Products"
          placeholderTextColor="#999"
          className="flex-1 px-2 text-black"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
        <TouchableOpacity onPress={() => setFilterVisible(true)}>
          <Icon name="tune" size={20} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <Tabs
        tabs={[
          'All',
          'Pending Orders',
          'In Progress Orders',
          'Completed Orders',
          'Cancelled Orders',
        ]}
      >
        {/* All */}
        <View className="bg-gray-50 p-4">
          {renderFlatList(filteredOrders, 'No orders available')}
        </View>
        {/* pending orders */}
        <View className="bg-gray-50 p-4">
          {renderFlatList(
            filteredOrders.filter(order => order.OrderStatus === 'Pending'),
            'No Pending orders available',
          )}
        </View>
        {/* in progress orders */}
        <View className="bg-gray-50 p-4">
          {renderFlatList(
            filteredOrders.filter(order => order.OrderStatus === 'Processing'),
            'No In progress orders available',
          )}
        </View>
        {/* completed orders */}
        <View className="bg-gray-50 p-4">
          {renderFlatList(
            filteredOrders.filter(
              order =>
                order.OrderStatus === 'Delivered' &&
                order?.ReceivedStatus === 'Confirmed',
            ),
            'No Completed orders available',
          )}
        </View>
        {/* cancelled orders */}
        <View className="bg-gray-50 p-4">
          {renderFlatList(
            filteredOrders.filter(order => order.OrderStatus === 'Cancelled'),
            'No Cancelled orders available',
          )}
        </View>
      </Tabs>

      {/* filter dialog modal */}
      <Modal
        visible={filterVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white rounded-t-2xl p-4">
            <Text className="text-lg font-semibold mb-4">Filter Orders</Text>

            {/* Status filter */}
            <TouchableOpacity
              className="p-3 border-b border-gray-200"
              onPress={() =>
                setSelectedStatus(
                  selectedStatus === 'Pending' ? null : 'Pending',
                )
              }
            >
              <Text
                className={
                  selectedStatus === 'Pending' ? 'text-blue-500' : 'text-black'
                }
              >
                Status: Pending
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="p-3 border-b border-gray-200"
              onPress={() =>
                setSelectedStatus(
                  selectedStatus === 'Delivered' ? null : 'Delivered',
                )
              }
            >
              <Text
                className={
                  selectedStatus === 'Delivered'
                    ? 'text-blue-500'
                    : 'text-black'
                }
              >
                Status: Completed
              </Text>
            </TouchableOpacity>

            {/* Date filter */}
            <TouchableOpacity
              className="p-3 border-b border-gray-200"
              onPress={() =>
                setDateFilter(dateFilter === 'last7days' ? null : 'last7days')
              }
            >
              <Text
                className={
                  dateFilter === 'last7days' ? 'text-blue-500' : 'text-black'
                }
              >
                Date: Last 7 Days
              </Text>
            </TouchableOpacity>

            {/* Actions */}
            <View className="flex-row justify-end gap-4 mt-4 space-x-3">
              <TouchableOpacity
                onPress={() => {
                  setSelectedStatus(null);
                  setDateFilter(null);
                  setFilterVisible(false);
                }}
                className="px-4 py-2 rounded-lg bg-gray-200"
              >
                <Text>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setFilterVisible(false)}
                className="px-4 py-2 rounded-lg bg-blue-500"
              >
                <Text className="text-white">Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default OrderScreen;
