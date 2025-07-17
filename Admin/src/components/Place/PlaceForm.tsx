import { StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Place } from '../../@types/Place';
import { useDispatch } from 'react-redux';
import { addPlace, editPlace } from '../../redux/slices/placeSlice';
import DropDownPicker from 'react-native-dropdown-picker';

type PlaceFormProps = {
  initialData?: Place | null;
  onClose: () => void;
};

const PlaceForm = ({ initialData, onClose }: PlaceFormProps) => {
  const dispatch = useDispatch();

  const [routeType, setRouteType] = useState<'ROUTE 1' | 'ROUTE 2' | 'ROUTE 3'>('ROUTE 1');
  const [routeName, setRouteName] = useState('');
  const [open, setOpen] = useState(false);

  const routeTypes = [
    { label: 'ROUTE 1', value: 'ROUTE 1' },
    { label: 'ROUTE 2', value: 'ROUTE 2' },
    { label: 'ROUTE 3', value: 'ROUTE 3' },
  ];

  useEffect(() => {
    if (initialData) {
      setRouteType(initialData['Route type']);
      setRouteName(initialData['Route Name']);
    }
  }, [initialData]);

  const handleSubmit = () => {
    const newPlace: Place = {
      id: initialData?.id ?? `${Date.now().toString()}${Math.floor(Math.random() * 1000)}`,
      'Route type': routeType,
      'Route Name': routeName.trim(),
    };

    if (initialData) {
      dispatch(editPlace(newPlace));
    } else {
      dispatch(addPlace(newPlace));
    }

    onClose();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="space-y-5"
    >
      <Text className="text-xl font-bold text-gray-800 my-2">
        {initialData ? 'Edit Delivery Place' : 'Add Delivery Place'}
      </Text>

      {/* DropDown */}
      <View style={{ zIndex: 1000 ,marginVertical:'4%' }}>
        <DropDownPicker
          open={open}
          value={routeType}
          items={routeTypes}
          setOpen={setOpen}
          setValue={setRouteType}
          placeholder="Select Route Type"
          onChangeValue={(value) => setRouteType(value as 'ROUTE 1' | 'ROUTE 2' | 'ROUTE 3')}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownBox}
          placeholderStyle={{ color: '#3D8BFD' }}
          labelStyle={{ color: '#3D8BFD', fontSize: 16 }}
          
        />
      </View>

      {/* Route Name Input */}
      <TextInput
        placeholder="Enter Route Name"
        value={routeName}
        onChangeText={setRouteName}
        className="border border-gray-300 p-4 shadow-slate-600 my-4 rounded-xl text-base text-gray-800 bg-white focus:border-primary"
        placeholderTextColor="#3D8BFD"

      />

      {/* Buttons */}
      <View className="flex-row justify-between pt-4">
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-primary py-3 px-6 rounded-xl flex-1 mr-2"
        >
          <Text className="text-white font-semibold text-center text-base">
            {initialData ? 'Update' : 'Add'} Place
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onClose}
          className="border border-primary py-3 px-6 rounded-xl flex-1 ml-2 bg-white"
        >
          <Text className="text-primary font-semibold text-center text-base">
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default PlaceForm;

const styles = StyleSheet.create({
  dropdown: {
    borderRadius: '4%',
    borderColor: '#3D8BFD',
    backgroundColor: '#fff',
    paddingHorizontal: '2%',
    minHeight: 50,
    zIndex: 1000,
    color: '#3D8BFD',
  },
  dropdownBox: {
    borderRadius: '4%',
    borderColor: '#3D8BFD',
    backgroundColor: '#fff',
    zIndex: 999,
  },

});
