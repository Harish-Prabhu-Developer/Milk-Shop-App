// PlaceForm.tsx
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { Place, Route, VehicleDetails } from '../../@types/Place';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

interface PlaceFormProps {
  onClose: () => void;
  onSubmit: (places: Place | Route | VehicleDetails) => void;
  formtype: 'places' | 'routes' | 'vehicles';
  initialValues?: Partial<Place> | Partial<Route> | Partial<VehicleDetails>;
}

const FORM_TYPES: Record<'places' | 'routes' | 'vehicles', string> = {
  places: 'Place',
  routes: 'Route',
  vehicles: 'Vehicle',
};

const PlaceForm = ({ onClose, onSubmit, formtype, initialValues }: PlaceFormProps) => {

  const Routes: Route[] = useSelector((state: RootState) => state.place.routes) || [];
  const Vehicles: VehicleDetails[] = useSelector((state: RootState) => state.place.Vehicles) || [];
  // State for text input fields
  const [routeGroup, setRouteGroup] = useState('');
  const [branchName, setBranchName] = useState('');
  const [location, setLocation] = useState('');
  const [distance, setDistance] = useState('');

  // Dropdowns: Route
  const [routeOpen, setRouteOpen] = useState(false);
  const [routeValue, setRouteValue] = useState<string | null>(null);
  const [routeItems, setRouteItems] = useState(
    Routes.map(route => ({
      label: route['Branch Name'],
      value: route.id,
    }))
  );


  // Dropdowns: Vehicle
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [vehicleValue, setVehicleValue] = useState<string | null>(null);
  const [vehicleItems, setVehicleItems] = useState([
    { label: 'Company Vehicle', value: 'COMPANY VEHICLE' },
    { label: 'Private Vehicle', value: 'PRIVATE VEHICLE' },
    { label: 'Customer Vehicle', value: 'CUSTOMER VEHICLE' },
  ]);

    // Dropdowns: Route
  const [routeplaceOpen, setRoutePlaceOpen] = useState(false);
  const [routeplaceValue, setRoutePlaceValue] = useState<string | null>(null);
  const [routeplaceItems, setRoutePlaceItems] = useState(
    Routes.map(route => ({
      label: route['Branch Name'],
      value: route.id,
    }))
  );

  // Dropdowns: Route Type
  const [routeTypesOpen, setRouteTypeOpen] = useState(false);
  const [routeTypesValue, setRouteTypeValue] = useState<string | null>(null);
  const [routeTypesItems, setRouteTypeItems] = useState([
    { label: 'ROUTE 1', value: 'ROUTE 1' },
    { label: 'ROUTE 2', value: 'ROUTE 2' },
    { label: 'ROUTE 3', value: 'ROUTE 3' },
    { label: 'ADDITIONAL', value: 'ADDITIONAL' },
  ]);

  // Load initial values when editing
  useEffect(() => {
    if (!initialValues) return;

    if (formtype === 'places') {
      const place = initialValues as Partial<Place>;
      setRouteGroup(place.RouteGroup || '');
      if (place.VehicleDetails?.type) setVehicleValue(place.VehicleDetails.type);
    } else if (formtype === 'routes') {
      const route = initialValues as Partial<Route>;
      setBranchName(route['Branch Name'] || '');
      setRouteTypeValue(route['Route type'] || null);
    } else if (formtype === 'vehicles') {
      const vehicle = initialValues as Partial<VehicleDetails>;
      setVehicleValue(vehicle.type || null);
      setLocation(vehicle.location || '');
      setDistance(vehicle.distance || '');
    }
  }, [formtype, initialValues]);

  const handleSubmit = () => {
    if (formtype === 'places') {
      const payload: Place = {
        id: initialValues?.id || Math.random().toString(36).slice(2),
        RouteGroup: routeGroup,
        Route: [], // Can be populated if needed
        VehicleDetails: vehicleValue
          ? {
              id: Math.random().toString(36).slice(2),
              type: vehicleValue as VehicleDetails['type'],
              location: '',
              distance: '',
            }
          : undefined,
      };
      onSubmit(payload);
    } else if (formtype === 'routes') {
      const payload: Route = {
        id: initialValues?.id || Math.random().toString(36).slice(2),
        'Route type': routeTypesValue as Route['Route type'],
        'Branch Name': branchName,
      };
      onSubmit(payload);
    } else if (formtype === 'vehicles') {
      const payload: VehicleDetails = {
        id: initialValues?.id || Math.random().toString(36).slice(2),
        type: vehicleValue as VehicleDetails['type'],
        location,
        distance,
      };
      onSubmit(payload);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="space-y-5"
    >
      <Text className="text-xl font-bold text-gray-800 my-3">
        {`${initialValues?'Edit':'Add'} ${FORM_TYPES[formtype]}`}
      </Text>

      {formtype === 'places' ? (
        <>
          <View>
            <Text className="text-lg font-bold text-gray-800 py-4">
              Route Group Name
            </Text>
            <TextInput
              placeholder="Enter Route Group Name"
              placeholderTextColor="gray"
              value={routeGroup}
              onChangeText={setRouteGroup}
              className="w-full border border-gray-800 px-4 py-4 rounded-lg text-lg text-gray-800"
            />
          </View>

          <View>
            <Text className="text-lg font-bold text-gray-800 py-4">Select Route Details</Text>
            <DropDownPicker
              open={routeplaceOpen}
              value={routeplaceValue}
              items={routeplaceItems}
              setOpen={setRoutePlaceOpen}
              setValue={setRoutePlaceValue}
              setItems={setRoutePlaceItems}
              placeholder="Select Route"
              placeholderStyle={{ color: 'gray' }}
              style={{ zIndex: 1000 }}
              dropDownDirection='BOTTOM'
              dropDownContainerStyle={{
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#000',
              }}
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
              placeholderStyle={{ color: 'gray' }}
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
              open={routeTypesOpen}
              value={routeTypesValue}
              items={routeTypesItems}
              setOpen={setRouteTypeOpen}
              setValue={setRouteTypeValue}
              setItems={setRouteTypeItems}
              placeholder="Choose a Route Type"
              placeholderStyle={{ color: 'gray' }}
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
              placeholderTextColor="gray"
              value={branchName}
              onChangeText={setBranchName}
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
              placeholderStyle={{ color: 'gray' }}
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
              value={location}
              onChangeText={setLocation}
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
              value={distance}
              onChangeText={setDistance}
              className="w-full border border-gray-800 px-4 mr-28 py-4 rounded-lg text-lg text-gray-800"
            />
          </View>
        </>
      ) : null}

      <View className="flex-row w-full items-center justify-evenly my-4">
        <TouchableOpacity
          className="bg-primary px-3 py-2 rounded-lg items-center shadow-lg shadow-gray-900"
          onPress={handleSubmit}
        >
          <Text className="text-lg font-bold text-white">
            {`${initialValues?'Edit':'Add'} ${FORM_TYPES[formtype]}`}
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
