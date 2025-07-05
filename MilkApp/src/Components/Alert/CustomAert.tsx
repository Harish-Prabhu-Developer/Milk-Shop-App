import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

type CustomAlertProps = {
  visible: boolean;
  title?: string;
  message?: string;
  btnText?: string;
  btnColor?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

const CustomAlert = ({
  visible,
  title = 'Are you sure?',
  btnText = 'Confirm',
  btnColor = 'bg-primary',
  message = 'This action cannot be undone.',
  onConfirm,
  onCancel,
}: CustomAlertProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View className="flex-1 justify-center items-center bg-black/50 px-2">
        <View className="w-full bg-white rounded-2xl py-6 shadow-lg max-w-[90%]">
          {/* Title */}
          <Text className="text-xl font-semibold text-gray-800 mb-2 text-center">
            {title}
          </Text>

          {/* Message */}
          <Text className="text-base text-gray-600 text-center mb-6">
            {message}
          </Text>

          {/* Buttons */}
          <View className="flex-row justify-center gap-4">
            <TouchableOpacity
              className="bg-gray-200 px-6 py-2 rounded-xl"
              onPress={onCancel}
            >
              <Text className="text-gray-700 font-medium">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`bg-primary px-6 py-2 rounded-xl ${btnColor}`}
              onPress={onConfirm}
            >
              <Text className="text-white font-semibold">{btnText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;
