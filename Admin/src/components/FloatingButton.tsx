import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type FloatingButtonProps = {
    onPress: () => void;
};
const FloatingButton = ({onPress}:FloatingButtonProps) => {
  return (
    <TouchableOpacity className="absolute bottom-10 right-5 bg-primary w-16 h-16 flex items-center justify-center rounded-full"
      onPress={onPress}>
      <MaterialIcons name="add" size={24} color="white" />
    </TouchableOpacity>
  );
};

export default FloatingButton;

const styles = StyleSheet.create({});
