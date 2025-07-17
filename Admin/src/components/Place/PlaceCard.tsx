import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Place } from '../../@types/Place';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type PlaceCardProps = {
  place: Place;
  onEdit: () => void;
  onDelete: () => void;
};

const PlaceCard = ({ place, onEdit, onDelete }: PlaceCardProps) => {
  return (
    <View  className="bg-white rounded-2xl mb-3 p-4 shadow-sm border border-gray-200">
      <View className="flex-row items-center justify-between">
        {/* Route Info */}
        <View className="flex-1 pr-4">
          <Text className="text-lg font-semibold text-gray-800 mb-1">
            {place['Route Name']}
          </Text>
          <Text className="text-sm text-gray-500">{place['Route type']}</Text>
        </View>

        {/* Actions */}
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity
            onPress={onEdit}
            className='p-2 '
            accessibilityLabel="Edit Place"
          >
            <Octicons name="pencil" size={20} color="#2563eb" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onDelete}
            className='p-2 '
            accessibilityLabel="Delete Place"
          >
            <MaterialIcons name="delete" size={22} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PlaceCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 9999,
  },
});
