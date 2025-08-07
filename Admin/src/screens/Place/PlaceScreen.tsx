// PlaceScreen.tsx
import { View, Text, FlatList, Modal } from 'react-native';
import React, { useState } from 'react';
import PlaceCard from '../../components/Place/PlaceCard';
import Header from '../../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { Place, Route } from '../../@types/Place';
import FloatingButton from '../../components/FloatingButton';
import PlaceForm from '../../components/Place/PlaceForm';
import { addPlace, addRoute, removePlace, removeRoute, updatePlace, updateRoute } from '../../redux/slices/placeSlice';

const PlaceScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [modalVisible, setModalVisible] = useState(false);
  const places: Place[] =
    useSelector((state: RootState) => state.place.places) || [];
  const [formtype, setFormType] = useState<'Place' | 'Route'>('Place');
  // Add state to track selected Place (for Route form)
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

  const [editingRouteId, setEditingRouteId] = useState<string | null>(null);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);

  const handleSubmit = (data: Place | Route, type: 'Place' | 'Route',EditStatus:boolean) => {
    if (type === 'Place') {
      if (EditStatus) {
        dispatch(updatePlace(data as Place));
      }else{
        dispatch(addPlace(data as Place));
      }
    } else if (type === 'Route' && selectedPlaceId) {
      if (EditStatus) {
        dispatch(updateRoute({ placeId: selectedPlaceId, route: data as Route }));
      } else {
        dispatch(addRoute({ placeId: selectedPlaceId, route: data as Route }));
      }
    }
    setModalVisible(false);
    setSelectedPlaceId(null);
    setEditingPlace(null);
    setEditingRouteId(null);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <Header title={'Delivery Place'} />
      <FlatList
        data={places}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item }) => (
          <PlaceCard
            Place={item}
            onAddRoute={() => {
              setSelectedPlaceId(item.id);
              setFormType('Route');
              setEditingRouteId(null);
              setModalVisible(true);
            }}
            onPlaceEdit={() => {
              setEditingPlace(item);
              setFormType('Place');
              setModalVisible(true);
            }}
            onPlaceDelete={() => {
              dispatch(removePlace(item.id));
            }}
            onRouteEdit={(routeId, placeId) => {
              setSelectedPlaceId(placeId);
              setEditingRouteId(routeId);
              setFormType('Route');
              setModalVisible(true);
            }}
            onRouteDelete={(routeId, placeId) => {
              dispatch(removeRoute({ placeId, routeId }));
            }}
          />
        )}
        ListEmptyComponent={() => (
          <View className=" items-center justify-center">
            <Text className="text-gray-500 font-bold">No places available</Text>
          </View>
        )}
      />

      <FloatingButton
        onPress={() => {
          setModalVisible(true);
          setFormType('Place');
        }}
      />
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 bg-black/50 justify-end">
          <PlaceForm
            onClose={() => {
              setModalVisible(false);
              setSelectedPlaceId(null);
              setEditingRouteId(null);
              setEditingPlace(null);
            }}
            onSubmit={handleSubmit}
            formtype={formtype}
            initialValues={
              formtype === 'Place'
                ? editingPlace || (null)
                : (() => {
                    const place = places.find(p => p.id === selectedPlaceId);
                    const route = place?.Route.find(
                      r => r.id === editingRouteId,
                    );
                    return {
                      ...place,
                      Route: route ? [route] : [],
                    } as Place;
                  })()
            }
            RouteID={formtype === 'Route' ? editingRouteId || '' : ''}
          />
        </View>
      </Modal>
    </View>
  );
};

export default PlaceScreen;
