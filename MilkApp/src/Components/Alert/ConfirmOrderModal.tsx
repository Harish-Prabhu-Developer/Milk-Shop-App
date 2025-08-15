import { Items } from '@/Utils/@types/Cart';
import { Order } from '@/Utils/@types/Order';
import { API_URL } from '@env';
import React from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


type ConfirmOrderModalProps = {
  visible: boolean;
  Order:Order;
  products: Items[];
  selectedProducts: Record<string, { selected: boolean; qty: number }>;
  onSelect: (productId: string) => void;
  onQuantityChange: (productId: string, qty: number) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmOrderModal: React.FC<ConfirmOrderModalProps> = ({
  visible,
  products,
  Order,
  selectedProducts,
  onSelect,
  onQuantityChange,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-center items-center bg-black/40 px-4">
        <View className="w-full bg-white rounded-3xl p-5 max-h-[85%] shadow-lg">
          <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
            Confirm Received Items
          </Text>

          <ScrollView className="mb-4">
           {products.map((product) => {
  const receivedItem = Order.ReceivedItems?.find(
    (item) => item.id === product.product._id
  );

  const isSelected = selectedProducts[product.product._id]?.selected ?? !!receivedItem;
  const qty =
    selectedProducts[product.product._id]?.qty ??
    receivedItem?.receivedQty ??
    0;

  return (
    <View
      key={product.product._id}
      className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm"
    >
      {/* Top Row: Image, Info, Checkbox */}
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-start space-x-3 flex-1">
          <Image
            source={{ uri: `${API_URL}/${product.product.image}` }}
            className="w-14 h-14 rounded-md bg-gray-200"
            resizeMode="cover"
          />
          <View className="flex-1 pl-4">
            <Text
              className="text-base font-semibold text-gray-800"
              numberOfLines={1}
            >
              {product.product.name}
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              {product.product.unit}
            </Text>
          </View>
        </View>

        {/* Checkbox */}
        <TouchableOpacity
          className="mt-1"
          onPress={() => onSelect(product.product._id)}
        >
          <MaterialIcons
            name={isSelected ? "check-box" : "check-box-outline-blank"}
            size={24}
            color={isSelected ? "#3B82F6" : "#9CA3AF"}
          />
        </TouchableOpacity>
      </View>

      {/* Quantity Stepper */}
      {isSelected && (
        <View className="flex-row items-center justify-between mt-4">
          <Text className="text-sm text-gray-600">Received Quantity</Text>
          <View className="flex-row items-center gap-2 space-x-3">
            <TouchableOpacity
              onPress={() =>
                onQuantityChange(product.product._id, Math.max(0, qty - 1))
              }
              className="w-7 h-7 bg-success rounded-full items-center justify-center"
            >
              <MaterialIcons name="remove" size={18} color="#fff" />
            </TouchableOpacity>

            <Text className="text-base font-semibold text-gray-800">{qty}</Text>

            <TouchableOpacity
              onPress={() => onQuantityChange(product.product._id, qty + 1)}
              className="w-7 h-7 bg-success rounded-full items-center justify-center"
            >
              <MaterialIcons name="add" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
})}

          </ScrollView>

          {/* Bottom Actions */}
          <View className="flex-row justify-end space-x-3 gap-4 mt-2">
            <TouchableOpacity
              onPress={onCancel}
              className="px-5 py-3 bg-gray-100 rounded-full shadow-sm"
            >
              <Text className="text-gray-700 font-semibold">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              className="px-6 py-3 bg-primary rounded-full shadow-sm"
            >
              <Text className="text-white font-semibold">Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmOrderModal;
