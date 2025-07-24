// PlaceScreen.tsx
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import Header from '../../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { Place, Route, VehicleDetails } from '../../@types/Place';
import PlaceCard from '../../components/Place/PlaceCard';
import PlaceForm from '../../components/Place/PlaceForm';
import { AppDispatch, RootState } from '../../redux/store';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const PlaceScreen = () => {
  const dispatch = useDispatch<AppDispatch>();

  const places: Place[] = useSelector((state: RootState) => state.place.places) || [];

  const [modalVisible, setModalVisible] = useState(false);
  const [formType, setFormType] = useState<'places' | 'routes' | 'vehicles'>('places');
  const [openNestedFBtn, setOpenNestedFBtn] = useState(false);

  const openForm = (type: 'places' | 'routes' | 'vehicles') => {
    setFormType(type);
    setModalVisible(true);
    setOpenNestedFBtn(false);
  };

  const handleFormSubmit = (data: Place | Route | VehicleDetails) => {
    if (formType === 'places') {
      console.log("PlacesData : ",data);
      // dispatch(addPlace(data as Place));
    } else if (formType === 'routes') {
      console.log("RoutesData : ",data);
      // dispatch(addRoute(data as Route));
    } else if (formType === 'vehicles') {
      console.log("VehiclesData : ",data);
      // dispatch(addVehicle(data as VehicleDetails));
    }

    setModalVisible(false);
  };

  const renderFabButton = (
    label: string,
    icon: string,
    bottom: number,
    type: 'places' | 'routes' | 'vehicles',
  ) => (
    <TouchableOpacity
      className="absolute right-5 bg-primary py-2 px-4 gap-2 flex-row items-center justify-center rounded-xl"
      style={{ bottom }}
      onPress={() => openForm(type)}
    >
      <MaterialIcons name={icon} size={24} color="white" />
      <Text className="text-white font-bold text-lg">{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      <Header title="Delivery Places" />

      {/* List Rendering or FlatList can be added here */}

      {/* Main FAB */}
      <TouchableOpacity
        className="absolute bottom-10 right-5 bg-primary w-16 h-16 flex items-center justify-center rounded-full"
        onPress={() => setOpenNestedFBtn(!openNestedFBtn)}
      >
        <MaterialIcons
          name={openNestedFBtn ? 'arrow-drop-up' : 'add'}
          size={30}
          color="white"
        />
      </TouchableOpacity>

      {/* Nested Buttons */}
      {openNestedFBtn && (
        <>
          {renderFabButton('Places', 'add', 230, 'places')}
          {renderFabButton('Vehicles', 'add', 170, 'vehicles')}
          {renderFabButton('Routes', 'add', 110, 'routes')}
        </>
      )}

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white rounded-t-3xl p-4">
            <PlaceForm
              onClose={() => setModalVisible(false)}
              onSubmit={handleFormSubmit}
              formtype={formType}
              initialValues={{}} // future: pass selected data for editing
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PlaceScreen;
