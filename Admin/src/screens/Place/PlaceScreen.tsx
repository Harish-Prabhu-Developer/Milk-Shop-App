// PlaceScreen.tsx
import { View, Text, FlatList, Modal, RefreshControl, ActivityIndicator } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import PlaceCard from '../../components/Place/PlaceCard';
import Header from '../../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { AddPlace, AddRoute, Place, Route } from '../../@types/Place';
import FloatingButton from '../../components/FloatingButton';
import PlaceForm from '../../components/Place/PlaceForm';
import { deletePlace, deleteRoute, fetchPlaces, newPlace, newRoute, updatePlace, updateRoute } from '../../redux/slices/placeSlice';


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
  const [refreshing, setRefreshing] = useState(false);
  const { loading, error } = useSelector((state: RootState) => state.user);
  const [isloading, setisLoading] = useState(loading);
  const fetchPlacesData = async () => {
    try {
      setisLoading(true);
      await dispatch(fetchPlaces());
      await new Promise(resolve => setTimeout(resolve, 1000)); // simulate delay
    } catch (error) {
      console.log('Error fetching Places:', error);
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacesData();
    console.log('Places:', places);
  }, []);

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPlacesData();
    setRefreshing(false);
  }, []);
  const handleSubmit = (data: Place | Route, type: 'Place' | 'Route',EditStatus:boolean) => {
    if (type === 'Place') {
      if (EditStatus) {
        console.log('Editing Place:', data);
        
        dispatch(updatePlace({id:data._id,data:data as AddPlace}));
      }else{
        console.log('Adding Place:', data);
        dispatch(newPlace(data as Place));
      }
    } else if (type === 'Route' && selectedPlaceId) {
      if (EditStatus) {
        console.log('Editing Route:', data);
        dispatch(updateRoute({ placeId: selectedPlaceId, routeId: data._id, data: data as AddRoute }));
      } else {
        console.log('Adding Route:', data);
        
        dispatch(newRoute({ id: selectedPlaceId, data:data as AddRoute }));
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
    {isloading?(
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4B5563" />
          <Text className="mt-2 text-gray-700">Loading Places...</Text>
        </View>
    ):(
      <FlatList
        data={places}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={({ item }) => (
          <PlaceCard
            Place={item}
            onAddRoute={() => {
              setSelectedPlaceId(item._id);
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
              dispatch(deletePlace(item._id));
            }}
            onRouteEdit={(routeId, placeId) => {
              setSelectedPlaceId(placeId);
              setEditingRouteId(routeId);
              setFormType('Route');
              setModalVisible(true);
            }}
            onRouteDelete={(routeId, placeId) => {
              dispatch(deleteRoute({ placeId, routeId }));
            }}
  
          />
        )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        ListEmptyComponent={() => (
          <View className=" flex-1 items-center justify-center">
            <Text className="text-gray-500 font-bold">No places available</Text>
          </View>
        )}
      />
    )}

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
                    const place = places.find(p => p._id === selectedPlaceId);
                    const route = place?.Route.find(
                      r => r._id === editingRouteId,
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
