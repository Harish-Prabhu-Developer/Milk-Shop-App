import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Order } from '../../@types/Order';
import { formatDate, GetDay, GetTime } from '../../utils/CustomFunctions/DateFunctions';

type OrderCardProps = {
  Order: Order;
};

const getStatusColor = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  "Out for Delivery": "bg-blue-100 text-blue-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
  Failed: "bg-red-100 text-red-800",
  Returned: "bg-red-100 text-red-800",
  Completed: "bg-emerald-100 text-emerald-800",
};

const OrderCard = ({ Order }: OrderCardProps) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const scale = useSharedValue(1);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.97, { damping: 8 });
  };

  const onPressOut = () => {
    scale.value = withSpring(1);
  };

  return (
  <Animated.View entering={FadeInUp.duration(500)}>
    <Animated.View
      style={[animatedCardStyle]}
      className="w-full bg-white px-4 py-5 mb-4 rounded-2xl border border-gray-300 shadow-lg"
    >
      {/* Order ID and Date */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold text-gray-900">#{Order.OrderId}</Text>
        <Text className="text-sm text-gray-700">{`${formatDate(Order.OrderDate)}`}</Text>
      </View>

      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center space-x-2 gap-1">
          <MaterialIcons name="calendar-today" size={18} color="#3D8BFD" />
          <Text className="text-sm text-gray-700 font-medium">
            {GetDay(Order.OrderDate)}
          </Text>
        </View>
        <View className="flex-row items-center space-x-2 gap-2">
          <MaterialIcons name="access-time" size={18} color="#3D8BFD" />
          <Text className="text-sm text-gray-700 font-medium">
            {GetTime(Order.OrderDate)}
          </Text>
        </View>
      </View>

{/* Cancelled Order Date */}
{Order.OrderStatus === 'Cancelled' && Order.CancelOrderDate && (
  <View className="mx-4 mt-4 p-4 bg-red-50 rounded-2xl border border-red-200 shadow-sm">
    <View className="flex-row items-center mb-2">
      <MaterialIcons name="cancel" size={22} color="#DC2626" />
      <Text className="ml-2 text-lg font-bold text-red-700">Order Cancelled</Text>
    </View>
    <View className="flex-row items-center space-x-2">
      <MaterialIcons name="access-time" size={18} color="#DC2626" />
      <Text className="text-sm pl-1 text-gray-700 font-medium">
        {`${GetTime(Order.CancelOrderDate)} ${formatDate(Order.CancelOrderDate)} (${GetDay(Order.CancelOrderDate)})`}
      </Text>
    </View>
  </View>
)}

      <View className="border-b border-gray-200 mb-4" />

      <View className="mb-4 space-y-2 gap-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-base text-gray-600">Order Status</Text>
          <Text
            className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor[Order.OrderStatus as keyof typeof getStatusColor]}`}
          >
            {Order.OrderStatus}
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-base text-gray-600">Payment</Text>
          <Text
            className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor[Order.PaymentStatus as keyof typeof getStatusColor]}`}
          >
            {Order.PaymentStatus}
          </Text>
        </View>
        {/* <View className="flex-row justify-between items-center">
          <Text className="text-base text-gray-600">Delivery</Text>
          <Text
            className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor[Order.DeliveryStatus as keyof typeof getStatusColor]}`}
          >
            {Order.DeliveryStatus}
          </Text>
        </View> */}
      </View>

      <View className="border-b border-gray-200 mb-4" />

      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center space-x-2">
          <SimpleLineIcons name="wallet" size={18} color="#3D8BFD" style={{ padding: 2 }} />
          <Text className="text-md text-gray-800 p-1 font-bold">Total</Text>
        </View>
        <Text className="text-xl font-extrabold text-primary">₹{Order.TotalAmount.toFixed(2)}</Text>
      </View>

      <View className="mt-5 flex-row justify-end">
        <TouchableOpacity
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={() => navigation.navigate('OrderDetailScreen', { Order })}
          className="bg-primary px-4 py-2 rounded-full shadow-md active:opacity-90"
          activeOpacity={0.85}
        >
          <View className="flex-row items-center space-x-2">
            <Text className="text-white text-md font-semibold">View Details</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  </Animated.View>
);

};

export default OrderCard;
