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
  const [openDropdown, setOpenDropdown] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Pear', value: 'pear' },
  ]);

  const renderDropDown = (label: string, placeholder: string) => (
    <View>
      <Text className="text-lg font-bold text-gray-800 py-4">{label}</Text>
      <DropDownPicker
        open={openDropdown}
        value={value}
        items={items}
        setOpen={setOpenDropdown}
        setValue={setValue}
        setItems={setItems}
        placeholder={placeholder}
        dropDownContainerStyle={{
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#000',
        }}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="space-y-5"
    >
      <Text className="text-xl font-bold text-gray-800 my-3">
        {`Edit / Add ${FORM_TYPES[formtype]}`}
      </Text>

      {formtype === 'places' && (
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

          {renderDropDown('Select Route Details', 'Choose a route')}
          {renderDropDown('Select Vehicle Details', 'Choose a vehicle')}
        </>
      )}

      {/* Future support for 'routes' and 'vehicles' forms goes here */}

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
