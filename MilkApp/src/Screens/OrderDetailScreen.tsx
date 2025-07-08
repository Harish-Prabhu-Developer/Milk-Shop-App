// OrderDetailScreen.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Platform, Alert, Linking, PermissionsAndroid } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Order, OrderProduct } from '@Utils/@types/Order';
import { StackNavigationProp } from '@react-navigation/stack';
import { formatDate, GetDay, GetTime } from '@Utils/CustomFunctions/DateFunctions';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { InvoiceTemplate } from '@Utils/Template/Download';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@Redux/Store';
import { addToMyOrders } from '@Redux/Order/OrderSlice';

const OrderDetailScreen = () => {
  const route = useRoute();
  const params = route.params as { Order: Order } | undefined;
  const navigation = useNavigation<StackNavigationProp<any>>();
  const dispatch = useDispatch<AppDispatch>();


  if (!params || !params.Order) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-gray-600">Order details not available.</Text>
      </View>
    );
  }

  const { Order } = params;

  const bgMap = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Processing: 'bg-blue-100 text-blue-800',
    Shipped: 'bg-purple-100 text-purple-800',
    Delivered: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
    Completed: 'bg-green-100 text-green-800',
    Failed: 'bg-red-100 text-red-800',
    'Out for Delivery': 'bg-orange-100 text-orange-800',
    Returned: 'bg-red-100 text-red-800',
  } as const;
  type BgMapStatus = keyof typeof bgMap;

  const Badge = ({ label, status }: { label: string; status: BgMapStatus | string }) => (
    <Text className={`px-3 py-1 text-xs rounded-full font-semibold ${bgMap[status as BgMapStatus] || 'bg-gray-100 text-gray-800'}`}>
      {label}: {status}
    </Text>
  );

  // const generateAndSharePDF = async () => {
  //   try {

  //     const options = { InvoiceTemplate, fileName: `invoice_${Order.OrderId}`, base64: false };
  //     const file = await RNHTMLtoPDF.convert(options.);
  //     await Share.open({ url: Platform.OS === 'android' ? `file://${file.filePath}` : file.filePath });
  //   } catch (err) {
  //     Alert.alert('Error', 'Unable to generate or share invoice.');
  //   }
  // };

  const renderProduct = (item: OrderProduct, index: number) => (
    <Animated.View
      key={item.id||index.toString()}
      entering={FadeInUp.duration(300)}
      className="flex-row items-center justify-between mb-3 p-4 bg-white rounded-2xl shadow-sm"
    >
      <View className="flex-row items-center">
        <View className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 mr-4">
          <Image source={item.image} className="w-full h-full" resizeMode="cover" />
        </View>
        <View>
          <Text className="text-base font-semibold text-gray-800">{item.name}</Text>
          <Text className="text-sm text-gray-500">{item.unit}</Text>
          <Text className="mt-1 text-gray-600">Qty: {item.quantity}</Text>
          <Text className="mt-1 text-gray-600">Price: ₹{item.price.toFixed(2)}</Text>
        </View>
      </View>
      <Text className="text-lg font-bold text-textPrimary">
        ₹{(item.price * item.quantity).toFixed(2)}
      </Text>
    </Animated.View>
  );

  // Reorder
  const handleReorder = async() => {
    const updatedOrder:Order = { 
      id: `ORD${Date.now()}`,
    ProductData: Order.ProductData,
    UserId: Order.UserId, 
    UserName: Order.UserName,    
    OrderId: `ORD${Date.now()}${"John Doe"}${Math.floor(Math.random() * 1000)}`, // Unique Order ID
    OrderDate: new Date().toISOString(),
    TotalAmount: Order.TotalAmount,
    OrderStatus: 'Pending',
    PaymentStatus: 'Pending',
    DeliveryStatus: 'Pending'
    };
    console.log('Updated Order:', updatedOrder);
    const res =await dispatch(addToMyOrders(updatedOrder));
      if (res.type === 'Order/addToMyOrders') {
        Alert.alert('Order Placed', 'Your order has been placed successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('OrderScreen') },
        ]);

      }
  };


const handleDownloadInvoice = async () => {
  try {
    const fileName = `invoice_${Order.OrderId}.pdf`;

    const options = {
      html: InvoiceTemplate(Order),
      fileName: fileName.replace('.pdf', ''),
      base64: false,
    };

    const file = await RNHTMLtoPDF.convert(options);
    const sourcePath = file.filePath;

    const sdkInt = typeof Platform.Version === 'number' ? Platform.Version : parseInt(Platform.Version as string, 10);
    let destPath = '';

    if (Platform.OS === 'android') {
      if (sdkInt <= 10) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'We need access to save your invoice to the Downloads folder.',
            buttonPositive: 'Allow',
            buttonNegative: 'Deny',
          }
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Cannot save invoices without storage access.');
          return;
        }

        destPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
      } else {
        // Android 11+ — fallback to app's private folder
        destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      }
    } else {
      // iOS
      destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    }

    await RNFS.copyFile(sourcePath!, destPath);

    Alert.alert('Download Complete', `Invoice saved to: ${destPath}`);
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Failed to generate or save the invoice.');
  }
};

  return (
    <>
      {/* Sticky Header */}
        <View className="absolute top-0 left-0 right-0 bg-primary p-2 z-10 min-h-[60px] pt-8 flex-row items-center justify-between shadow-md">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-3">
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-semibold">Order Details</Text>
        <TouchableOpacity className="p-3" onPress={handleDownloadInvoice}>
          <MaterialIcons name="receipt-long" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingTop: 70, paddingBottom: 140 }} className="flex-1 bg-gray-50">
        {/* Order Info */}
        <View className="p-4 bg-white shadow-sm rounded-b-2xl">
          <Text className="text-lg font-bold text-gray-800">
            Order ID: <Text className="text-gray-600 font-medium">#{Order.OrderId}</Text>
          </Text>
          <View className="flex-row justify-between mt-2">
            <Text className="font-bold text-gray-800">Order Date:</Text>
            <Text className="text-gray-500">{`${formatDate(Order.OrderDate)} (${GetDay(Order.OrderDate)})`}</Text>
          </View>
          <View className="flex-row justify-between mt-1">
            <Text className="font-bold text-gray-800">Order Time:</Text>
            <Text className="text-gray-500">{GetTime(Order.OrderDate)}</Text>
          </View>
          <View className="flex-row gap-2 mt-3 flex-wrap">
            <Badge label="Order" status={Order.OrderStatus} />
            <Badge label="Payment" status={Order.PaymentStatus} />
            <Badge label="Delivery" status={Order.DeliveryStatus} />
          </View>
        </View>

        {/* Product List */}
        <View className="p-4">
          <Text className="text-lg font-bold text-gray-800 mb-2">Products</Text>
          {Order.ProductData.map(renderProduct)}
        </View>

        {/* Total */}
        <View className="px-4 py-5 bg-white shadow-sm border-t border-gray-200">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-semibold text-primary">Total Amount</Text>
            <Text className="text-xl font-extrabold text-gray-800">₹{Order.TotalAmount.toFixed(2)}</Text>
          </View>
        </View>

        {/* Customer Info */}
        <View className="p-5 mt-3 mx-4 mb-8 bg-white rounded-2xl shadow-md border border-gray-200 space-y-3">
          <Text className="text-base font-bold text-gray-800 mb-2">Customer Information</Text>
          <View className="flex-row items-center">
            <FontAwesome name="user-circle" size={18} color="#4B5563" />
            <Text className="ml-2 text-sm text-gray-700 font-medium">{Order.UserName}</Text>
          </View>
        </View>
      </ScrollView>
{/* order.OrderStatus !== 'Delivered' && order.OrderStatus !== 'Cancelled' */}
      {/* Bottom CTA */}

{
  (Order.OrderStatus === 'Delivered' || Order.OrderStatus === 'Cancelled') && (
    <View className="absolute bottom-8 left-0 right-0 bg-gray-50 p-4 border border-gray-200 z-20 shadow-xl">
      <TouchableOpacity onPress={handleReorder} className="bg-primary py-3 rounded-full items-center">
        <Text className="text-white font-bold text-lg">Reorder This Order</Text>
      </TouchableOpacity>
    </View>
  )
}

      
    </>
  );
};

export default OrderDetailScreen;
