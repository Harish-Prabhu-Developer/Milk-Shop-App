// PlaceCard.tsx
import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Place, Route } from '../../@types/Place';
import { FlatList } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
type PlaceCardProps = {
  Place: Place;
  onAddRoute?: () => void; // Optional prop for adding a route
  onPlaceEdit?: () => void; // Optional prop for editing the place
  onPlaceDelete?: () => void; // Optional prop for deleting the place
  onRouteEdit?: (routeId: string,placeId:string) => void; // Optional prop for editing a route
  onRouteDelete?: (routeId: string,placeId:string) => void; // Optional prop for deleting
};

const PlaceCard = ({
  Place,
  onAddRoute,
  onPlaceEdit,
  onPlaceDelete,
  onRouteEdit,
  onRouteDelete,
}: PlaceCardProps) => {
  return (
    <View className="m-4 p-3 bg-gray-50 border border-gray-300 rounded-lg shadow-md">
      {/* Header with Edit/Delete */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="font-bold text-2xl">{Place.RouteGroup}</Text>
        <View className="flex-row items-center space-x-2 gap-4">
          <TouchableOpacity
            className="bg-white border border-blue-500 px-4 py-2 rounded-lg"
            onPress={onPlaceEdit}
          >
            <Text className="text-blue-500 font-bold">Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white border border-red-500 px-4 py-2 rounded-lg"
            onPress={onPlaceDelete}
          >
            <Text className="text-red-500 font-bold">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Vehicle Details */}
      <View className="mb-4">
        <Text className="font-bold text-lg">Vehicle Details</Text>
        <Text className="text-gray-600">Vehicle Type: {Place.type}</Text>
        <Text className="text-gray-600">Location: {Place.location}</Text>
        <Text className="text-gray-600">Distance: {Place.distance}</Text>
      </View>

      {/* Route List */}
      <View>
        <View className="flex-row items-center justify-between mb-2">
          <Text className="font-bold text-lg">Route Details</Text>
          <TouchableOpacity
            className="bg-primary px-4 py-2 rounded-lg"
            onPress={onAddRoute}
          >
            <Text className="text-white font-bold">+ Add Route</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={Place.Route}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="mb-2 flex-row items-center bg-gray-100 border border-gray-300 px-2 py-3 my-2 rounded-lg justify-between">
              <View className="gap-2">
                <Text className="font-bold">{item['Route type']}</Text>
                <Text className="text-gray-600">{item['Branch Name']}</Text>
              </View>
              <View className="flex-row items-center gap-4">
                <TouchableOpacity
                  className="bg-white border border-blue-500 px-2 py-2 rounded-lg"
                  onPress={() => onRouteEdit?.(item.id, Place.id)}
                >
                  <MaterialIcons name="edit" size={16} color="#3b82f6" />
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-white border border-red-500 px-2 py-2 rounded-lg"
                  onPress={() => onRouteDelete?.(item.id, Place.id)}
                >
                  <MaterialIcons name="delete" size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <Text className="text-center text-gray-500">No routes available</Text>
          )}
        />
      </View>
    </View>
  );
};
export default PlaceCard;