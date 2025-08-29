import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  BackHandler,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LineChart, PieChart } from 'react-native-chart-kit';
import Header from '../components/Header';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DashboardType } from '../@types/Dashboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@env';

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = () => {
  const [dashboardData, setDashboardData] = useState<DashboardType | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const handleBackPress = () => {
    Alert.alert('Exit App', 'Are you sure you want to exit?', [
      { text: 'Cancel', onPress: () => null, style: 'cancel' },
      { text: 'Exit', onPress: () => BackHandler.exitApp() },
    ]);
    return true;
  };

  const getHeaders = async () => {
    const token = await AsyncStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchApi = async () => {
    try {
      const headers = await getHeaders();
      const response = await axios.get(
        `${API_URL}/milkapp/analytics/dashboard`,
        headers,
      );
      setDashboardData(response.data);
    } catch (error) {
      console.log('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );
      return () => {
        backHandler.remove();
      };
    }, []),
  );

  const renderCart = ({
    value,
    name,
    IconName,
    IconColor,
    onPress,
  }: {
    value: string;
    name: string;
    IconName: string;
    IconColor: string;
    onPress: () => void;
  }) => {
    return (
      <Card
        className="w-[48%] m-1 px-4 py-4 rounded-xl shadow shadow-gray-400"
        onPress={onPress}
      >
        {IconName === 'money' ? (
          <Text className={`font-semibold text-4xl ${IconColor}`}>₹</Text>
        ) : (
          <Icon name={IconName} size={30} color={IconColor} />
        )}
        <Text className="font-semibold text-lg mt-2">{name}</Text>
        <Text className="font-bold text-2xl">{value}</Text>
      </Card>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-black/45">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!dashboardData) {
    return (
      <View className="flex-1 bg-white">
        <Header title='Dashboard'/>
        <View className='items-center justify-center flex-1'>
          <Text>Failed to load dashboard data</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Header title={'Dashboard'} />
      <ScrollView className="mt-4 p-4"
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={fetchApi}
        />
      }>
        
        {/* Top Stats */}
        <View className="flex-row flex-wrap items-center gap-4 mb-4">
          {renderCart({
            value: dashboardData.CardAnalytics.totalOrders.toString(),
            name: 'Orders',
            IconName: 'shopping-cart',
            IconColor: '#4CAF50',
            onPress() {
              navigation.navigate('OrderScreen');
            },
          })}
          {renderCart({
            value: dashboardData.CardAnalytics.delivered.toString(),
            name: 'Delivered',
            IconName: 'check-circle',
            IconColor: '#2196F3',
            onPress() {
              navigation.navigate('OrderScreen');
            },
          })}
          {renderCart({
            value: dashboardData.CardAnalytics.pending.toString(),
            name: 'Pending',
            IconName: 'hourglass-empty',
            IconColor: '#FFC107',
            onPress() {
              navigation.navigate('OrderScreen');
            },
          })}
          {renderCart({
            value: dashboardData.CardAnalytics.processing.toString(),
            name: 'Processing',
            IconName: 'autorenew',
            IconColor: '#03A9F4',
            onPress() {
              navigation.navigate('OrderScreen');
            },
          })}
          {renderCart({
            value: dashboardData.CardAnalytics.cancelled.toString(),
            name: 'Cancelled',
            IconName: 'cancel',
            IconColor: '#F44336',
            onPress() {
              navigation.navigate('OrderScreen');
            },
          })}
          {renderCart({
            value: `₹${dashboardData.CardAnalytics.revenue.toString()}`,
            name: 'Revenue',
            IconName: 'money',
            IconColor: 'text-red-500',
            onPress() {
              navigation.navigate('OrderScreen');
            },
          })}
        </View>

        {/* Sales Trend */}
        <Text className="text-xl font-bold my-2">Last 7 Days Sales</Text>
        <LineChart
          data={{
            labels: dashboardData.Last7Sales.map(data => data.label),
            datasets: [{ data: dashboardData.Last7Sales.map(d => d.value) }],
          }}
          width={screenWidth - 20}
          height={220}
          yAxisLabel="₹"
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#f9f9f9',
            backgroundGradientTo: '#f9f9f9',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForDots: {
              r: '5',
              strokeWidth: '2',
              stroke: '#2196F3',
            },
          }}
          style={{ marginVertical: 10, borderRadius: 10 }}
        />

        {/* Orders by Status */}
        <Text className="text-xl font-bold my-2">Orders by Status</Text>
        <PieChart
          data={[
            {
              name: 'Pending',
              population: dashboardData.CardAnalytics.pending,
              color: '#FFC107',
              legendFontColor: '#333',
              legendFontSize: 14,
            },
            {
              name: 'Delivered',
              population: dashboardData.CardAnalytics.delivered,
              color: '#4CAF50',
              legendFontColor: '#333',
              legendFontSize: 14,
            },
            {
              name: 'Processing',
              population: dashboardData.CardAnalytics.processing,
              color: '#2196F3',
              legendFontColor: '#333',
              legendFontSize: 14,
            },
            {
              name: 'Cancelled',
              population: dashboardData.CardAnalytics.cancelled,
              color: '#F44336',
              legendFontColor: '#333',
              legendFontSize: 14,
            },
          ]}
          width={screenWidth - 20}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          style={{ marginBottom: 20 }}
        />

        {/* Recent Orders */}
        <Text className="text-xl font-bold my-2">Recent Orders</Text>
        <View className="mt-4 mb-12">
          {dashboardData.Recent5Orders.length > 0 ? (
            dashboardData.Recent5Orders.map(order => (
              <TouchableOpacity
                key={order.id}
                className="p-4 mb-3 bg-gray-100 rounded-xl"
                onPress={() =>
                  navigation.navigate('OrderDetailScreen', {
                    Order: order.orderdetails,
                  })
                }
              >
                <View className="flex-row justify-between p-2 items-center">
                  <View>
                    <Text className="text-lg font-semibold">
                      {order.branchName}
                    </Text>
                    <Text
                      className={`text-sm ${
                        order.status === 'Delivered'
                          ? 'text-green-600'
                          : order.status === 'Pending'
                            ? 'text-yellow-600'
                            : order.status === 'Processing'
                              ? 'text-blue-600'
                              : 'text-red-600'
                      }`}
                    >
                      {order.status}
                    </Text>
                  </View>
                  <Text className="text-lg font-bold">₹{order.amount}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text className="text-center text-gray-500">
              No recent orders found
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;
