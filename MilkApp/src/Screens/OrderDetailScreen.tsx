// OrderDetailScreen.tsx
import React, { useState } from 'react';
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
import FileViewer from "react-native-file-viewer";
import Animated, { FadeInUp } from 'react-native-reanimated';
import { InvoiceTemplate } from '@Utils/Template/Download';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@Redux/Store';
import { addToMyOrders, cancelOrder,confirmOrder } from '@Redux/Order/OrderSlice';
import ConfirmOrderModal from '@Components/Alert/ConfirmOrderModal';

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
const [modalVisible, setModalVisible] = useState(false);
const [selectedProducts, setSelectedProducts] = useState<Record<string, { selected: boolean; qty: number }>>(
  Object.fromEntries(Order.ProductData.map(product => [product.id, { selected: true, qty: product.quantity }]))
);

const toggleProductSelection = (productId: string) => {
  setSelectedProducts(prev => ({
    ...prev,
    [productId]: {
      ...prev[productId],
      selected: !prev[productId]?.selected,
    },
  }));
};

const updateProductQuantity = (productId: string, qty: number) => {
  setSelectedProducts(prev => ({
    ...prev,
    [productId]: {
      ...prev[productId],
      qty,
    },
  }));
};

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
    Branch: { id: 'BRN001', branchType: 'AKC OUT', branchName: 'Branch A', phone: '1234567890', location: 'Location A',routeType:'ROUTE 1',routeName:'Route 1' },    
    OrderId: `ORD${Date.now()}${"John Doe"}${Math.floor(Math.random() * 1000)}`, // Unique Order ID
    OrderDate: new Date().toISOString(),
    TotalAmount: Order.TotalAmount,
    OrderStatus: 'Pending',
    PaymentStatus: 'Pending',
    ReceivedStatus: 'Pending'
    };
    console.log('Updated Order:', updatedOrder);
    const res =await dispatch(addToMyOrders(updatedOrder));
      if (res.type === 'Order/addToMyOrders') {
        Alert.alert('Order Placed', 'Your order has been placed successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('OrderScreen') },
        ]);

      }
  };

// Function to open a file
const openFile = (path: string): void => {
  FileViewer.open(path)
    .then(() => {
      console.log('Success', path);
    })
    .catch((error: unknown) => {
      console.error('Error opening file:', error);
    });
};
const ShareFile = (path: string): void => {
  if (!path) {
    console.error('File path is undefined or empty.');
    return;
  }

  Share.open({ url: `file://${path}` }) // Ensure the path is formatted correctly as a file URL
    .then((res) => {
      console.log('Share successful:', res);
    })
    .catch((err) => {
      if (err) {
        console.error('Error while sharing file:', err);
      }
    });
};
const handleModalConfirm = async () => {
  const receivedItems = Object.entries(selectedProducts)
    .filter(([_, data]) => data.selected && data.qty > 0)
    .map(([id, data]) => ({
      id,
      receivedQty: data.qty,
    }));

  const res = await dispatch(confirmOrder({ id: Order.OrderId, receivedItems }));

  if (res.type === 'Order/confirmOrder') {
    setModalVisible(false);
    Alert.alert('Order Received', 'Your order has been received successfully!', [
      { text: 'OK', onPress: () => navigation.navigate('OrderScreen') },
    ]);
  }
};



const handleCancelOrder = async () => {
  try {
    const res = await dispatch(cancelOrder({id:Order.OrderId}));
    if (res.type === 'Order/cancelOrder') {
      Alert.alert('Order Cancelled', 'Your order has been cancelled successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('OrderScreen') },
      ]);
    }
  } catch (error) {
    console.error('Error cancelling order:', error);
  }
}
const handleDownloadInvoice = async () => {
  try {
    const fileName = `invoice_${Order.OrderId}.pdf`;

    const options = {
      html: InvoiceTemplate(Order),
      fileName: fileName.replace('.pdf', ''),
      base64: false,
      directory: 'Download',
    };

    const file = await RNHTMLtoPDF.convert(options);

      //Alert.alert('Success', `PDF generated at: ${file.filePath}`);
      Alert.alert('Success', `Successfully PDF generated`, [
      
        {
          text: 'Open',
          onPress: () => openFile(`${file.filePath}`),
        },
        {
          text: 'Share',
          onPress: () => ShareFile(`${file.filePath}`),
          
        },
      ]);
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Failed to generate or save the invoice.');
  }
};

  return (
    <>
      <ConfirmOrderModal
        visible={modalVisible}
        products={Order.ProductData}
        selectedProducts={selectedProducts}
        onSelect={toggleProductSelection}
        onQuantityChange={updateProductQuantity}
        onCancel={() => setModalVisible(false)}
        onConfirm={handleModalConfirm}
      />

      {/* Sticky Header */}
        <View className="absolute top-0 left-0 right-0 bg-primary p-2 z-10 min-h-[60px] pt-8 flex-row items-center justify-between shadow-md">
        <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: 'OrderScreen' }] })} className="p-3">
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
            {/* <Badge label="Delivery" status={Order.DeliveryStatus} /> */}
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

<View className="mx-4 my-4 p-4 bg-white rounded-2xl shadow-md border border-gray-100">
  <Text className="text-xl font-bold text-gray-800 mb-6">Order Tracking</Text>

  {[
    {
      label: 'Order Placed',
      statusCheck: () => true,
      activeCheck: () => Order.OrderStatus === 'Pending',
      date: Order.OrderDate,
    },
    {
      label: 'In-Progress',
      statusCheck: () => ['Processing', 'Delivered'].includes(Order.OrderStatus),
      activeCheck: () => Order.OrderStatus === 'Processing',
      date: Order.ConfirmOrderDate || Order.OrderDate,
    },
    {
      label: 'Received Delivered',
      statusCheck: () => ['Delivered', 'Completed'].includes(Order.OrderStatus),
      activeCheck: () => Order.OrderStatus === 'Delivered',
      date: Order.ReceivedDate,
    },
  ].map((step, index, arr) => {
    const isCompleted = step.statusCheck();
    const isActive = step.activeCheck();

    const circleColor = isCompleted || isActive ? 'bg-primary' : 'bg-gray-400';
    const lineColor = index < arr.length - 1 ? (isCompleted ? 'bg-primary' : 'bg-gray-300') : '';

    return (
      <View key={index} className="flex-row items-start mb-6 relative">
        {/* Step Indicator */}
        <View className="items-center mr-4">
          <View className={`w-5 h-5 rounded-full ${circleColor} border-2 border-white`} />
          {index < arr.length - 1 && <View className={`w-0.5 h-10 ${lineColor}`} />}
        </View>

        {/* Step Content */}
        <View className="flex-1">
          <Text className={`text-base font-semibold ${isCompleted || isActive ? 'text-gray-800' : 'text-gray-400'}`}>
            {step.label}
          </Text>
          {(isCompleted || isActive) && step.date && (
            <Text className="text-xs text-gray-500 mt-1">
              {formatDate(step.date)} - {GetTime(step.date)}
            </Text>
          )}
        </View>
      </View>
    );
  })}
</View>

{/* Received Products */}
{/* Received Products */}
<View className="p-4">
  <Text className="text-lg font-bold text-gray-800 mb-2">Received Products</Text>

  {Array.isArray(Order.ReceivedItems) && Order.ReceivedItems.length > 0 ? (
    Order.ReceivedItems.map((receivedItem) => {
      const product = Order.ProductData.find(p => p.id === receivedItem.id);
      if (!product) return null;

      return (
        <View
          key={product.id}
          className="flex-row items-center justify-between mb-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100"
        >
          <View className="flex-row items-center">
            <View className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 mr-4">
              <Image
                source={product.image}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View>
              <Text className="text-base font-semibold text-gray-800">{product.name}</Text>
              <Text className="text-sm text-gray-500">{product.unit}</Text>
              <Text className="mt-1 text-gray-600">Received: {receivedItem.receivedQty}</Text>
              <Text className="mt-1 text-gray-600">Price: ₹{product.price.toFixed(2)}</Text>
            </View>
          </View>
          <Text className="text-lg font-bold text-textPrimary">
            ₹{(product.price * receivedItem.receivedQty).toFixed(2)}
          </Text>
        </View>
      );
    })
  ) : (
    <Text className="text-gray-500">No items received for this order.</Text>
  )}
</View>


        {/* Customer Info */}
        <View className="p-5 mt-3 mx-4 mb-16 bg-white rounded-2xl shadow-md border border-gray-200 space-y-3">
          <Text className="text-base font-bold text-gray-800 mb-2">Branch Information</Text>
          <View className="flex-row items-center">
            <FontAwesome name="user-circle" size={18} color="#4B5563" />
            <Text className="ml-2 text-sm text-gray-700 font-medium">{Order.Branch?.branchName}</Text>
          </View>
        </View>
      </ScrollView>
{/* order.OrderStatus !== 'Delivered' && order.OrderStatus !== 'Cancelled' */}
      {/* Bottom CTA */}

<View className="absolute bottom-4 left-0 right-0 px-4 py-5 bg-white border-t border-gray-200 z-30 shadow-xl rounded-t-2xl">
  {(Order.OrderStatus === 'Cancelled' || Order.ReceivedStatus === 'Confirmed') ? (
    <TouchableOpacity
      onPress={handleReorder}
      className="bg-primary py-4 rounded-full items-center shadow-md flex-row justify-center"
    >
      <MaterialIcons name="repeat" size={20} color="#fff" />
      <Text className="text-white font-bold text-lg ml-2">Reorder This Order</Text>
    </TouchableOpacity>
  ) : (
    <View className="flex-row justify-between space-x-4">
      {/* Confirm Received Button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="flex-1 flex-row items-center justify-center bg-success py-4 mx-1 rounded-full shadow-md"
      >
        <MaterialIcons name="check-circle" size={20} color="#fff" />
        <Text className="ml-2 text-white font-semibold text-base">Confirm Received</Text>
      </TouchableOpacity>

      {/* Cancel Order Button */}
      <TouchableOpacity
        onPress={handleCancelOrder}
        className="flex-1 flex-row items-center justify-center bg-red-500 py-4 mx-1 rounded-full shadow-md"
      >
        <MaterialIcons name="cancel" size={20} color="#fff" />
        <Text className="ml-2 text-white font-semibold text-base">Cancel Order</Text>
      </TouchableOpacity>
    </View>
  )}
</View>


      
    </>
  );
};

export default OrderDetailScreen;
