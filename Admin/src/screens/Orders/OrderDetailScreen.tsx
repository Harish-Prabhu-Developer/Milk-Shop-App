import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { Order } from '../../@types/Order';
import { AppDispatch } from '../../redux/store';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
const OrderDetailScreen = () => {
     const route = useRoute();
  const params = route.params as { Order: Order } | undefined;
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const dispatch = useDispatch<AppDispatch>();

  if (!params || !params.Order) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-gray-600">
          Order details not available.
        </Text>
      </View>
    );
  }

  const { Order } = params;
    
  return (
    <View className=''>
          {/* Sticky Header */}
      <View className="absolute top-0 left-0 right-0 bg-primary p-2 z-10 min-h-[60px] pt-8 flex-row items-center justify-between shadow-md">
        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
          className="p-3"
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-semibold">Order Details</Text>
        <TouchableOpacity className="p-3" 
            // onPress={handleDownloadInvoice}
            >
          <MaterialIcons name="receipt-long" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text>OrderDetailScreen</Text>
    </View>
  )
}

export default OrderDetailScreen