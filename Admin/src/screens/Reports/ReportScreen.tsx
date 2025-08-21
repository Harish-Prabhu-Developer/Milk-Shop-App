// ReportScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LineChart, PieChart } from 'react-native-chart-kit';
import Header from '../../components/Header';
import SalesReport from './SalesReport';

const screenWidth = Dimensions.get('window').width;

const ReportScreen = () => {
  const [dateRange, setDateRange] = useState('This Week');

  // Mock Data (replace with API later)
  const salesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [1200, 1500, 1800, 1600, 2000, 2200, 1900],
        strokeWidth: 2,
      },
    ],
  };

  const productData = [
    { name: 'Milk', population: 45, color: '#4CAF50', legendFontColor: '#333', legendFontSize: 12 },
    { name: 'Curd', population: 25, color: '#2196F3', legendFontColor: '#333', legendFontSize: 12 },
    { name: 'Paneer', population: 15, color: '#FFC107', legendFontColor: '#333', legendFontSize: 12 },
    { name: 'Ghee', population: 15, color: '#F44336', legendFontColor: '#333', legendFontSize: 12 },
  ];

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <Header title={'Reports'} />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Date Range Filter */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold">Overview ({dateRange})</Text>
          <TouchableOpacity
            onPress={() =>
              setDateRange(dateRange === 'This Week' ? 'This Month' : 'This Week')
            }
            className="px-3 py-1 bg-gray-200 rounded-full"
          >
            <Text className="text-sm text-gray-700">Change</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View className="flex-row flex-wrap gap-3 mb-4">
          <Card style={{ flex: 1, padding: 12 }}>
            <Text className="text-gray-500">Total Sales</Text>
            <Text className="text-xl font-bold">₹ 12,500</Text>
          </Card>
          <Card style={{ flex: 1, padding: 12 }}>
            <Text className="text-gray-500">Orders</Text>
            <Text className="text-xl font-bold">340</Text>
          </Card>
        </View>

        <View className="flex-row flex-wrap gap-3 mb-6">
          <Card style={{ flex: 1, padding: 12 }}>
            <Text className="text-gray-500">Customers</Text>
            <Text className="text-xl font-bold">120</Text>
          </Card>
          <Card style={{ flex: 1, padding: 12 }}>
            <Text className="text-gray-500">Pending Payments</Text>
            <Text className="text-xl font-bold">₹ 2,100</Text>
          </Card>
        </View>

        {/* Sales Trend Chart */}
        <Text className="text-base font-semibold mb-2">📈 Sales Trend</Text>
        <LineChart
          data={salesData}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
            strokeWidth: 2,
          }}
          bezier
          style={{ borderRadius: 8, marginBottom: 24 }}
        />

        {/* Product Distribution Pie Chart */}
        <Text className="text-base font-semibold mb-2">🥛 Product Sales Distribution</Text>
<PieChart
  data={productData}
  width={screenWidth - 32}
  height={220}
  accessor="population"
  backgroundColor="transparent"
  paddingLeft="15"
  chartConfig={{
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // fallback for legends
  }}
/>


        {/* Report Categories */}
        <Text className="text-base font-semibold mt-6 mb-3">📂 Report Categories</Text>
        <View className="gap-3">
          {[
            { label: 'Sales Report', icon: 'bar-chart' },
            { label: 'Customer Report', icon: 'people' },
            { label: 'Delivery Report', icon: 'local-shipping' },
            { label: 'Product Report', icon: 'inventory' },
            { label: 'Payment Report', icon: 'payments' },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center bg-gray-100 p-3 rounded-xl"
              // onPress={}
            >
              <Icon name={item.icon} size={22} color="#333" />
              <Text className="ml-3 text-gray-800">{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default ReportScreen;
