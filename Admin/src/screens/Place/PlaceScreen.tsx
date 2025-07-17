import { FlatList, Modal, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import Header from '../../components/Header';
import { StatusBar } from 'react-native';
import FloatingButton from '../../components/FloatingButton';
import { useDispatch, useSelector } from 'react-redux';
import { Place } from '../../@types/Place';
import PlaceCard from '../../components/Place/PlaceCard';
import PlaceForm from '../../components/Place/PlaceForm';
import { removePlace } from '../../redux/slices/placeSlice';
import { AppDispatch, RootState } from '../../redux/store';

const ROUTES = ['ROUTE 1', 'ROUTE 2', 'ROUTE 3'] as const;

const PlaceScreen = () => {
  const dispatch = useDispatch<AppDispatch>();

  const places: Place[] =
    useSelector((state: RootState) => state.place.places) || [];
  console.log('Places:', places);

  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const groupedPlaces = ROUTES.map(routeType => ({
    routeType,
    data: places.filter(p => p['Route type'] === routeType),
  }));

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle={'light-content'} />
      <Header title="Delivery Places" />

      <View className='mb-36'>
        <FlatList
          data={groupedPlaces}
          keyExtractor={item => item.routeType}
          renderItem={({ item }) => (
            <View className="mb-4 px-4">
              <Text className="text-lg font-bold text-gray-700 mb-2">
                {item.routeType}
              </Text>
              {item.data.length === 0 ? (
                <Text className="text-gray-400 italic text-center">
                  No places found
                </Text>
              ) : (
                item.data.map((place: Place) => (
                  <PlaceCard
                    key={place.id}
                    place={place}
                    onEdit={() => {
                      setSelectedPlace(place);
                      setModalVisible(true);
                    }}
                    onDelete={() => dispatch(removePlace(place.id))}
                  />
                ))
              )}
            </View>
          )}
        />
      </View>

      {/* Floating Add Button */}
      <FloatingButton
        onPress={() => {
          setSelectedPlace(null);
          setModalVisible(true);
        }}
      />

      {/* Modal Form */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white rounded-t-3xl p-4">
            <PlaceForm
              initialData={selectedPlace}
              onClose={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PlaceScreen;

const styles = StyleSheet.create({});
