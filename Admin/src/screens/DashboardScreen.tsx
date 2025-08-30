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
import { ActivityIndicator, Card } from 'react-native-paper';
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
  const [errorMsg, setErrorMsg] = useState('');

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
      setLoading(true);
      setErrorMsg('');
      const headers = await getHeaders();
      const response = await axios.get(
        `${API_URL}/milkapp/analytics/dashboard`,
        headers,
      );
      setDashboardData(response.data);
    } catch (error) {
      console.log('Error fetching dashboard:', error);
      setErrorMsg('Failed to load dashboard data');
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
      <TouchableOpacity
        activeOpacity={0.8}
        className="w-[48%] m-1 rounded-2xl bg-white shadow-md p-5 border border-gray-300"
        onPress={onPress}
      >
        <View className="flex-row items-center mb-3">
          {IconName === 'money' ? (
            <Text className={`font-bold text-3xl ${IconColor}`}>₹</Text>
          ) : (
            <Icon name={IconName} size={28} color={IconColor} />
          )}
        </View>
        <Text className="text-gray-600 font-medium">{name}</Text>
        <Text className="text-2xl font-extrabold text-gray-900">{value}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Loading Overlay */}
      {loading && (
        <View className="absolute top-0 left-0 right-0 bottom-0 flex-row gap-4 items-center justify-center bg-black/40 z-50">
          <ActivityIndicator size="large" color="#3D8BFD" />
          <Text className="text-white text-lg font-bold mt-2">Loading...</Text>
        </View>
      )}

      <Header title="Dashboard" />

      {/* Error State */}
      {errorMsg && !loading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-red-500 font-semibold">{errorMsg}</Text>
          <TouchableOpacity
            onPress={fetchApi}
            className="mt-4 bg-blue-500 px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-bold">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Dashboard Content */}
      {dashboardData && !loading && (
        <ScrollView
          className="mt-2 p-4"
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchApi} />
          }
        >
          {/* Top Stats */}
          <View className="flex-row flex-wrap justify-between mb-4 ">
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
          <View className="bg-white rounded-2xl border-gray-300 border shadow-md p-4 mb-6">
            <Text className="text-xl font-bold mb-2 text-gray-800">
              Last 7 Days Sales
            </Text>
            <ScrollView horizontal>
              <LineChart
                data={{
                  labels: dashboardData.Last7Sales.map(data => data.label),
                  datasets: [
                    { data: dashboardData.Last7Sales.map(d => d.value) },
                  ],
                }}
                width={screenWidth - 40}
                height={220}
                yAxisLabel="₹"
                chartConfig={{
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  propsForDots: { r: '5', strokeWidth: '2', stroke: '#2196F3' },
                }}
                style={{ borderRadius: 12 }}
              />
            </ScrollView>
          </View>

          {/* Orders by Status */}
          <View className="bg-white border border-gray-300 rounded-2xl shadow-md p-4 mb-6">
            <Text className="text-xl font-bold mb-2 text-gray-800">
              Orders by Status
            </Text>
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
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              style={{ borderRadius: 12 }}
            />
          </View>

          {/* Recent Orders */}
          <View className="bg-white border border-gray-300 rounded-2xl shadow-md p-4 mb-12">
            <Text className="text-xl font-bold mb-4 text-gray-800">
              Recent Orders
            </Text>
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
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text className="text-lg font-semibold text-gray-800">
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
                    <Text className="text-lg font-bold text-gray-900">
                      ₹{order.amount}
                    </Text>
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
      )}
    </View>
  );
};

export default DashboardScreen;
