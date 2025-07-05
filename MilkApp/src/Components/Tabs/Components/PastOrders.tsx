import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Order } from '@Utils/@types/Order';
import OrderCard from '@Components/Card/OrderCard';

type PastOrdersProps = {
  OrdersData: Order[];
};
const PastOrders = ({OrdersData}: PastOrdersProps) => {
      const [refreshing, setRefreshing] = useState<boolean>(false);

  // Simulated data fetch
  const fetchProductsData = async () => {
    // setLoading(true);
    try {
      // await dispatch(fetchProducts()); // if using Redux thunk
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.log('Error fetching products:', error);
    } finally {
    //   setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchProductsData();
  }, []);
  // This effect can be used to fetch products data when the component mounts
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProductsData();
    setRefreshing(false);
  }, []);
  console.log('Past Orders Data:', OrdersData);
  return (
    <View className=' bg-gray-50 p-4'>
        <FlatList
          data={OrdersData}
          renderItem={({item}) => <OrderCard Order={item} />}
          keyExtractor={(item) => item.OrderId.toString()}
          contentContainerStyle={{paddingBottom: 20}}
          refreshing={false}
          onRefresh={() => {
            <RefreshControl refreshing={false} onRefresh={() => { }}/>
          }}
        />
      
    </View>
  )
}

export default PastOrders

const styles = StyleSheet.create({})