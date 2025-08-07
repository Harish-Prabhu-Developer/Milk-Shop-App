import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import { Branch } from '../../@types/User';
import DropDownPicker from 'react-native-dropdown-picker';
import { useSelector } from 'react-redux';
import { Place, Route } from '../../@types/Place';
import { RootState } from '../../redux/store';
import { KeyboardAvoidingView } from 'react-native';

interface UserFormProps {
  initialData?: Branch;
  onSubmit: (data: Branch) => void;
  onCancel: () => void;
}

const UserForm = ({ initialData, onSubmit, onCancel }: UserFormProps) => {
  const [branch, setBranch] = useState<Branch>(
    initialData || {
      id: '',
      branchName: '',
      phone: '',
      location: '',
      routeName: '',
      type: 'NKC Local',
    },
  );

  const PlaceDetails: Place[] = useSelector(
    (state: RootState) => state.place.places,
  );
  const [openBranch, setOpenBranch] = useState(false);
  const [openRoute, setOpenRoute] = useState(false);
  const [openType, setOpenType] = useState(false);
  
  const handleChange = (key: keyof Branch, value: string) => {
    setBranch({ ...branch, [key]: value });
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="bg-white rounded-2xl p-4"
    >
      <Text className="text-2xl font-bold text-gray-800 mb-6">
        Branch Details
      </Text>
      <ScrollView keyboardShouldPersistTaps="handled">
        {/* Route Name Dropdown */}
        <View className="mb-4 z-20">
          <Text className="text-lg font-semibold text-gray-700 my-4">
            Branch Name
          </Text>
          <DropDownPicker
            open={openBranch}
            value={branch.branchName}
            items={PlaceDetails.flatMap(P =>
              P.Route.map(R => ({
                label: R['Branch Name'],
                value: R['Branch Name'],
              }))
            )}
            setOpen={setOpenBranch}
            setValue={callback =>
              setBranch(prev => ({
                ...prev,
                branchName: callback(prev.branchName) as Branch['branchName'],
              }))
            }
            placeholder="Select Branch Name"
            placeholderStyle={{ color: 'gray' }}
            dropDownContainerStyle={{
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#000',
            }}
            listMode="SCROLLVIEW"
          />
        </View>
        {/* Contact Person */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-gray-700 my-4">
            Contact Person
          </Text>
          <TextInput
            placeholder="e.g., Ramesh"
            value={branch.contactPerson}
            onChangeText={text => handleChange('contactPerson', text)}
            className="w-full border border-gray-800 px-4 py-4 rounded-lg text-lg text-gray-800"
            placeholderTextColor="gray"
          />
        </View>
        {/* Type Dropdown */}
        <View className="mb-4 z-10">
          <Text className="text-lg font-semibold text-gray-700 my-4">Type</Text>
          <DropDownPicker
            open={openType}
            value={branch.type}
            items={[
              { label: 'NKC Local', value: 'NKC Local' },
              { label: 'NKC OUT', value: 'NKC OUT' },
              { label: 'AKC Local', value: 'AKC Local' },
              { label: 'AKC OUT', value: 'AKC OUT' },
            ]}
            setOpen={setOpenType}
            setValue={callback =>
              setBranch(prev => ({
                ...prev,
                type: callback(prev.type) as Branch['type'],
              }))
            }
            placeholder="Select Type"
            placeholderStyle={{ color: 'gray' }}
            dropDownContainerStyle={{
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#000',
            }}
            listMode="SCROLLVIEW"
            dropDownDirection='AUTO'
          />
        </View>
        {/* Phone */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-gray-700 my-4">
            Phone Number
          </Text>
          <TextInput
            placeholder="e.g., 9876543210"
            value={branch.phone}
            keyboardType="number-pad"
            onChangeText={text => handleChange('phone', text)}
            className="w-full border border-gray-800 px-4 py-4 rounded-lg text-lg text-gray-800"
            placeholderTextColor="gray"
          />
        </View>

        {/* Location */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-gray-700 my-4">
            Location
          </Text>
          <TextInput
            placeholder="e.g., Chennai"
            value={branch.location}
            onChangeText={text => handleChange('location', text)}
            className="w-full border border-gray-800 px-4 py-4 rounded-lg text-lg text-gray-800"
            placeholderTextColor="gray"
          />
        </View>

        {/* Route Name Dropdown */}
        <View className="mb-4 z-20">
          <Text className="text-lg font-semibold text-gray-700 my-4">
            Route Name
          </Text>
          <DropDownPicker
            open={openRoute}
            value={branch.routeName}
            items={PlaceDetails.flatMap(P =>
              P.Route.map(R => ({
                label: R['Branch Name'],
                value: R['Branch Name'],
              }))
            )}
            setOpen={setOpenRoute}
            setValue={callback =>
              setBranch(prev => ({
                ...prev,
                routeName: callback(prev.routeName) as Branch['routeName'],
              }))
            }
            placeholder="Select Route Name"
            placeholderStyle={{ color: 'gray' }}
            dropDownContainerStyle={{
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#000',
            }}
            listMode="SCROLLVIEW"
          />
        </View>

        {/* Action Buttons */}
        <View className="flex-row w-full items-center justify-around gap-4 mt-4 mb-16">
          <TouchableOpacity
            onPress={onCancel}
            className="border border-primary bg-white rounded-lg px-5 py-2"
          >
            <Text className="text-lg font-bold text-primary">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onSubmit(branch)}
            className="bg-primary px-3 py-2 rounded-lg items-center shadow-lg shadow-gray-900"
          >
            <Text className="text-lg font-bold text-white">Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UserForm;
