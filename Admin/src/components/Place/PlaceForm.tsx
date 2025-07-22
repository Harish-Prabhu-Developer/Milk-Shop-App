import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

interface PlaceFormProps {
  onClose: () => void;
  formtype: 'places' | 'routes' | 'vehicles';
}

const FORM_TYPES: Record<'places' | 'routes' | 'vehicles', string> = {
  places: 'Place',
  routes: 'Route',
  vehicles: 'Vehicle',
};

const PlaceForm = ({ onClose, formtype }: PlaceFormProps) => {
  // Dropdown states for Route
  const [routeOpen, setRouteOpen] = useState(false);
  const [routeValue, setRouteValue] = useState<string | null>(null);
  const [routeItems, setRouteItems] = useState([
    { label: 'Chennai', value: '3439009fdjshfdk34' },
    { label: 'Coimbatore', value: 'djlkfj23232jkldjs23' },
  ]);

  // Dropdown states for Vehicle
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [vehicleValue, setVehicleValue] = useState<string | null>(null);
  const [vehicleItems, setVehicleItems] = useState([
    { label: 'Company Vehicle', value: 'COMPANY VEHICLE' },
    { label: 'Private Vehicle', value: 'PRIVATE VEHICLE' },
    { label: 'Customer Vehicle', value: 'CUSTOMER VEHICLE' },
  ]);
  // Dropdown states for Route Type
  const [RouteTypesOpen, setRouteTypeOpen] = useState(false);
  const [RouteTypesValue, setRouteTypeValue] = useState<string | null>(null);
  const [RouteTypesItems, setRouteTypeItems] = useState([
    { label: 'ROUTE 1', value: 'ROUTE 1' },
    { label: 'ROUTE 2', value: 'ROUTE 2' },
    { label: 'ROUTE 3', value: 'ROUTE 3' },
    {label:'ADDITIONAL', value:'ADDITIONAL'},
  ]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="space-y-5"
    >
      <Text className="text-xl font-bold text-gray-800 my-3">
        {`Edit / Add ${FORM_TYPES[formtype]}`}
      </Text>

      {formtype === 'places' ? (
        <>
          <View>
            <Text className="text-lg font-bold text-gray-800 py-4">
              Route Group Name
            </Text>
            <TextInput
              placeholder="Enter Route Group Name"
              placeholderTextColor="#000"
              className="w-full border border-gray-800 px-4 py-4 rounded-lg text-lg text-gray-800"
            />
          </View>

          <View>
            <Text className="text-lg font-bold text-gray-800 py-4">Select Route Details</Text>
            <DropDownPicker
              open={routeOpen}
              value={routeValue}
              items={routeItems}
              setOpen={setRouteOpen}
              setValue={setRouteValue}
              setItems={setRouteItems}
              placeholder="Select Route"
              dropDownContainerStyle={{
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#000',
              }}
              style={{ zIndex: 1000 }}
            />
          </View>

          <View style={{ zIndex: 999 }}>
            <Text className="text-lg font-bold text-gray-800 py-4">Select Vehicle Details</Text>
            <DropDownPicker
              open={vehicleOpen}
              value={vehicleValue}
              items={vehicleItems}
              setOpen={setVehicleOpen}
              setValue={setVehicleValue}
              setItems={setVehicleItems}
              placeholder="Select Vehicle"
              dropDownContainerStyle={{
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#000',
              }}
            />
          </View>
        </>
      ) : formtype === 'routes' ? (
     <>
          <View style={{ zIndex: 1000 }}>
            <Text className="text-lg font-bold text-gray-800 py-4">
              Route Type
            </Text>
            <DropDownPicker
              open={RouteTypesOpen}
              value={RouteTypesValue}
              items={RouteTypesItems}
              setOpen={setRouteTypeOpen}
              setValue={setRouteTypeValue}
              setItems={setRouteTypeItems}
              placeholder="Choose a Route Type"
              dropDownContainerStyle={{
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#000',
              }}
            />
          </View>
          <View>
              <Text className="text-lg font-bold text-gray-800 py-4">
                Branch Name
              </Text>
              <TextInput
                placeholder="Enter Branch Name"
                placeholderTextColor="#000"
                className="w-full border border-gray-800 px-4 py-4 rounded-lg text-lg text-gray-800"
              />
            </View>
    </>
      ) : formtype === 'vehicles' ? (
        <>
          <View style={{ zIndex: 1000 }}>
            <Text className="text-lg font-bold text-gray-800 py-4">
              Vehicle type
            </Text>
            <DropDownPicker
              open={vehicleOpen}
              value={vehicleValue}
              items={vehicleItems}
              setOpen={setVehicleOpen}
              setValue={setVehicleValue}
              setItems={setVehicleItems}
              placeholder="Choose a vehicle type"
              dropDownContainerStyle={{
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#000',
              }}
            />
          </View>

          <View>
            <Text className="text-lg font-bold text-gray-800 py-4">
              Location
            </Text>
            <TextInput
              placeholder="Enter the Location"
              placeholderTextColor="gray"
              className="w-full border border-gray-800 px-4 py-4 rounded-lg text-lg text-gray-800"
            />
          </View>
          <View>
            <Text className="text-lg font-bold text-gray-800 py-4">
              Distance
            </Text>
            <TextInput
              placeholder="Enter the Distance"
              
              placeholderTextColor="gray"
              className="w-full border border-gray-800 px-4 mr-28 py-4 rounded-lg text-lg text-gray-800"
            />
          </View>
        </>
      ) : null}

      <View className="flex-row w-full items-center justify-evenly my-4">
        <TouchableOpacity className="bg-primary px-3 py-2 rounded-lg items-center shadow-lg shadow-gray-900">
          <Text className="text-lg font-bold text-white">
            Add {FORM_TYPES[formtype]}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="border border-primary bg-white rounded-lg px-5 py-2"
          onPress={onClose}
        >
          <Text className="text-lg font-bold text-primary">Cancel</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default PlaceForm;
