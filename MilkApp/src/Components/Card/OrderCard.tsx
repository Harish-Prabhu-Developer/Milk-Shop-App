import { Image, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Order } from '@Utils/@types/Order';
import { formatDate } from '@Utils/CustomFunctions/DateFunctions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

type OrderCardProps = {
  Order: Order;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Processing':
    case 'Out for Delivery':
      return 'bg-blue-100 text-blue-800';
    case 'Delivered':
      return 'bg-green-100 text-green-800';
    case 'Cancelled':
    case 'Failed':
    case 'Returned':
      return 'bg-red-100 text-red-800';
    case 'Completed':
      return 'bg-emerald-100 text-emerald-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const OrderCard = ({ Order }: OrderCardProps) => {
    const navigation = useNavigation<StackNavigationProp<any>>();
  return (
    <TouchableOpacity className="w-full bg-white px-4 py-5 mb-4 rounded-2xl border border-gray-100 shadow-md"
                     onPress={() => navigation.navigate('OrderDetailScreen', { Order })}>
      {/* Order ID and Date */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold text-gray-800">
          #{Order.OrderId}
        </Text>
        <Text className="text-sm text-gray-500">{formatDate(Order.OrderDate)}</Text>
      </View>

      {/* Divider */}
      <View className="border-b border-gray-200 mb-4" />

      {/* Status Section */}
      <View className="mb-4 space-y-2">
        <View className="flex-row justify-between items-center">
          <Text className="text-base text-gray-600">Order Status</Text>
          <Text className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(Order.OrderStatus)}`}>
            {Order.OrderStatus}
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-base text-gray-600">Payment</Text>
          <Text className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(Order.PaymentStatus)}`}>
            {Order.PaymentStatus}
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-base text-gray-600">Delivery</Text>
          <Text className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(Order.DeliveryStatus)}`}>
            {Order.DeliveryStatus}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View className="border-b border-gray-200 mb-4" />

      {/* Customer and Amount */}
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center space-x-2">
          <Icon name="person" size={18} color="#6B7280" />
          <Text className="text-sm text-gray-600">Customer</Text>
        </View>
        <Text className="text-sm font-medium text-gray-800">{Order.UserName}</Text>
      </View>

      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center space-x-2">
          <Icon name="payments" size={18} color="#6B7280" />
          <Text className="text-sm text-gray-600">Total</Text>
        </View>
        <Text className="text-lg font-extrabold text-emerald-600">₹{Order.TotalAmount.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default OrderCard;
