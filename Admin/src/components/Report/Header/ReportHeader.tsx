import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
interface ReportHeaderProps {
    title:string;
    onFilterPress: () => void;
}
const ReportHeader = ({title,onFilterPress}:ReportHeaderProps) => {
      const navigation = useNavigation<StackNavigationProp<any>>();
    
  return (
      <View className="bg-primary pt-12 pb-8 px-5 shadow-md rounded-b-3xl">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="mr-3"
            >
              <MaterialIcons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
            <Text className="text-2xl text-white font-bold">{title}</Text>
          </View>
          <TouchableOpacity
            onPress={onFilterPress}
            className="bg-white/20 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-semibold">Filter</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
};

export default ReportHeader;
