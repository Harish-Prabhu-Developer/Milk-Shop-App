// Fixes across PlaceForm.tsx
// Main fixes:
// 1. Remove incorrect useEffect
// 2. Set route dropdown value correctly
// 3. Handle form values cleanly for edit vs. create
// 4. Minor naming, UI, type consistency improvements

import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Place, Route, ROUTETYPES } from '../../@types/Place';
import { Platform } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

// Props
type PlaceFormProps = {
  onClose: () => void;
  onSubmit: (
    data: Place | Route,
    type: 'Place' | 'Route',
    EditStatus: boolean,
  ) => void;
  formtype: 'Place' | 'Route';
  initialValues?: Partial<Place | null>;
  RouteID: string;
};
const PlaceForm = ({
  onClose,
  onSubmit,
  initialValues,
  formtype,
  RouteID,
}: PlaceFormProps) => {
  const [Data, setData] = useState({
    RouteGroup: initialValues?.RouteGroup || '',
    location: initialValues?.location || '',
    Route: initialValues?.Route || [],
    type: initialValues?.type || 'COMPANY VEHICLE',
    distance: initialValues?.distance || '',
    id: initialValues?.id || `${Date.now()}`,
  });

  // Vehicle Type Dropdown
  const [openType, setOpenType] = useState(false);
  const [Typevalue, setTypeValue] = useState(Data.type);
  const [Typeitems, setTypeItems] = useState([
    { label: 'COMPANY VEHICLE', value: 'COMPANY VEHICLE' },
    { label: 'PRIVATE VEHICLE', value: 'PRIVATE VEHICLE' },
    { label: 'CUSTOMER VEHICLE', value: 'CUSTOMER VEHICLE' },
  ]);

  // Route Form States
  const [openRouteType, setOpenRouteType] = useState(false);
  const [RouteTypevalue, setRouteTypeValue] = useState<string | null>(null);
  const [RouteTypeitems, setRouteTypeItems] = useState([
    { label: 'ROUTE 1', value: 'ROUTE 1' },
    { label: 'ROUTE 2', value: 'ROUTE 2' },
    { label: 'ROUTE 3', value: 'ROUTE 3' },
    { label: 'ADDITIONAL', value: 'ADDITIONAL' },
  ]);
  const [branchName, setBranchName] = useState('');

  useEffect(() => {
    if (formtype === 'Route') {
      setRouteTypeValue(initialValues?.Route?.[0]?.['Route type'] || null);
      setBranchName(initialValues?.Route?.[0]?.['Branch Name'] || '');
    }
    console.log(initialValues, 'initial');
  }, [formtype]);

  const handleSubmit = () => {
    if (formtype === 'Place') {
      if (initialValues) {
        const updatedplace: Place = {
          ...Data,
          type: Typevalue || 'COMPANY VEHICLE',
        };

        onSubmit(updatedplace, 'Place', true);
      } else {
        const newPlace: Place = {
          id: Data.id,
          location: Data.location,
          type: Typevalue || 'COMPANY VEHICLE',
          RouteGroup: Data.RouteGroup,
          distance: Data.distance,
          Route: Data.Route || [],
        };
        onSubmit(newPlace, 'Place', false);
      }
    } else if (formtype === 'Route') {
      if (initialValues?.Route?.length===1) {
        const updatedRoute: Route = {
          id: initialValues?.Route?.[0].id || Date.now().toString(),
          'Route type': RouteTypevalue as ROUTETYPES,
          'Branch Name': branchName.trim(),
        };


        onSubmit(updatedRoute, 'Route', true);
      } else {
        if (!RouteTypevalue || !branchName.trim()) {
          Alert.alert(
            'Missing Fields',
            'Please fill both Route Type and Branch Name',
          );
          return;
        }
        const newRoute: Route = {
          id: Date.now().toString(),
          'Route type': RouteTypevalue as ROUTETYPES,
          'Branch Name': branchName.trim(),
        };

        onSubmit(newRoute, 'Route', false);
      }
    }
    onClose();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="bg-white rounded-2xl p-4 m-1"
    >
      <Text className="text-2xl font-bold text-gray-800 mb-2">
        {initialValues ? `Edit ${formtype}` : `Add ${formtype}`}
      </Text>

      {formtype === 'Place' && (
        <>
          <View className="mb-2">
            <Text className="text-lg font-bold text-gray-700 my-2">
              Route Group Name
            </Text>
            <TextInput
              placeholder="Enter Route Group Name"
              value={Data.RouteGroup}
              onChangeText={text => setData({ ...Data, RouteGroup: text })}
              className="w-full border border-gray-800 px-4 py-4 rounded-lg text-lg text-gray-800"
              placeholderTextColor="gray"
            />
          </View>
          <View className="mb-2 z-10">
            <Text className="text-lg font-semibold text-gray-700 my-2">
              Vehicle Type
            </Text>
            <DropDownPicker
              open={openType}
              value={Typevalue}
              items={Typeitems}
              setOpen={setOpenType}
              setValue={setTypeValue}
              onChangeValue={value => {
                if (value)
                  setData({
                    ...Data,
                    type: value as
                      | 'COMPANY VEHICLE'
                      | 'PRIVATE VEHICLE'
                      | 'CUSTOMER VEHICLE',
                  });
              }}
              placeholder="Select Type"
              placeholderStyle={{ color: 'gray' }}
              dropDownContainerStyle={{
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#000',
              }}
              listMode="SCROLLVIEW"
              dropDownDirection="AUTO"
            />
          </View>
          <View className="mb-2">
            <Text className="text-lg font-bold text-gray-700 my-2">
              Location
            </Text>
            <TextInput
              placeholder="Enter Location"
              value={Data.location}
              onChangeText={text => setData({ ...Data, location: text })}
              className="w-full border border-gray-800 px-4 py-4 rounded-lg text-lg text-gray-800"
              placeholderTextColor="gray"
            />
          </View>
          <View className="mb-2">
            <Text className="text-lg font-bold text-gray-700 my-2">
              Distance
            </Text>
            <TextInput
              placeholder="Enter Distance"
              value={Data.distance}
              onChangeText={text => setData({ ...Data, distance: text })}
              className="w-full border border-gray-800 px-4 py-4 rounded-lg text-lg text-gray-800"
              placeholderTextColor="gray"
            />
          </View>
        </>
      )}

      {formtype === 'Route' && (
        <>
          <View className="mb-2">
            <Text className="text-lg font-bold text-gray-700 my-2">
              Branch Name
            </Text>
            <TextInput
              placeholder="Enter Branch Name"
              value={branchName}
              onChangeText={text => setBranchName(text)}
              className="w-full border border-gray-800 px-4 py-4 rounded-lg text-lg text-gray-800"
              placeholderTextColor="gray"
            />
          </View>
          <View className="mb-2 z-10">
            <Text className="text-lg font-semibold text-gray-700 my-2">
              Route Type
            </Text>
            <DropDownPicker
              open={openRouteType}
              value={RouteTypevalue}
              items={RouteTypeitems}
              setOpen={setOpenRouteType}
              setValue={setRouteTypeValue}
              placeholder="Select Route Type"
              placeholderStyle={{ color: 'gray' }}
              dropDownContainerStyle={{
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#000',
              }}
              listMode="SCROLLVIEW"
              dropDownDirection="AUTO"
            />
          </View>
        </>
      )}

      <View className="flex-row w-full items-center justify-around gap-4 mt-4 mb-2">
        <TouchableOpacity
          onPress={onClose}
          className="border border-primary bg-white rounded-lg px-8 py-2"
        >
          <Text className="text-lg font-bold text-primary">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-primary px-8 py-2 rounded-lg items-center shadow-lg shadow-gray-900"
        >
          <Text className="text-lg font-bold text-white">Submit</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default PlaceForm;
