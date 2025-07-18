import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Branch } from '../../@types/User';
import DropDownPicker from 'react-native-dropdown-picker';
import { useSelector } from 'react-redux';
import { Place } from '../../@types/Place';

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
    }
  );

  const PlaceDetails: Place[] = useSelector((state: any) => state.place.places);
  const [openBranch, setOpenBranch] = useState(false);
  const [openRoute, setOpenRoute] = useState(false);
  const [openType, setOpenType] = useState(false);


  const handleChange = (key: keyof Branch, value: string) => {
    setBranch({ ...branch, [key]: value });
  };

  return (
    <View className="px-4 py-6 bg-white">
      <Text className="text-2xl font-bold text-gray-800 mb-6">Branch Details</Text>

      {/* Route Name Dropdown */}
      <View className="mb-4 z-20">
        <Text className="text-base font-semibold text-gray-700 mb-1">Branch Name</Text>
        <DropDownPicker
          open={openBranch}
          value={branch.branchName}
          items={PlaceDetails.map((place) => ({
            // label: place['Route Name'],
            // value: place['Route Name'],
          }))}
          setOpen={setOpenBranch}
          setValue={(callback) =>
            setBranch((prev) => ({
              ...prev,
              branchName: callback(prev.branchName) as Branch["branchName"],
            }))
          }
          placeholder="Select Branch Name"
          placeholderStyle={{ color: '#9CA3AF' }}
          style={{
            borderColor: '#D1D5DB',
            borderRadius: 12,
            backgroundColor: '#F9FAFB',
          }}
          dropDownContainerStyle={{
            borderColor: '#D1D5DB',
            backgroundColor: '#fff',
            borderRadius: 12,
            zIndex: 9999,
          }}
          textStyle={{
            fontSize: 16,
            color: '#1F2937',
          }}
        />
      </View>
      {/* Contact Person */}
      <View className="mb-4">
        <Text className="text-base font-semibold text-gray-700 mb-1">Contact Person</Text>
        <TextInput
          placeholder="e.g., Ramesh"
          value={branch.contactPerson}
          placeholderTextColor="#9CA3AF"
          onChangeText={(text) => handleChange('contactPerson', text)}
          className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800 bg-gray-50"
        />
      </View>

      {/* Phone */}
      <View className="mb-4">
        <Text className="text-base font-semibold text-gray-700 mb-1">Phone Number</Text>
        <TextInput
          placeholder="e.g., 9876543210"
          value={branch.phone}
          keyboardType="number-pad"
          placeholderTextColor="#9CA3AF"
          onChangeText={(text) => handleChange('phone', text)}
          className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800 bg-gray-50"
        />
      </View>

      {/* Location */}
      <View className="mb-4">
        <Text className="text-base font-semibold text-gray-700 mb-1">Location</Text>
        <TextInput
          placeholder="e.g., Chennai"
          value={branch.location}
          placeholderTextColor="#9CA3AF"
          onChangeText={(text) => handleChange('location', text)}
          className="border border-gray-300 rounded-xl px-4 py-3 text-gray-800 bg-gray-50"
        />
      </View>

      {/* Route Name Dropdown */}
      <View className="mb-4 z-20">
        <Text className="text-base font-semibold text-gray-700 mb-1">Route Name</Text>
        <DropDownPicker
          open={openRoute}
          value={branch.routeName}
          items={PlaceDetails.map((place) => ({
            // label: place['Route Name'],
            // value: place['Route Name'],
          }))}
          setOpen={setOpenRoute}
          setValue={(callback) =>
            setBranch((prev) => ({
              ...prev,
              routeName: callback(prev.routeName) as Branch["routeName"],
            }))
          }
          placeholder="Select Route Name"
          placeholderStyle={{ color: '#9CA3AF' }}
          style={{
            borderColor: '#D1D5DB',
            borderRadius: 12,
            backgroundColor: '#F9FAFB',
          }}
          dropDownContainerStyle={{
            borderColor: '#D1D5DB',
            backgroundColor: '#fff',
            borderRadius: 12,
            zIndex: 9999,
          }}
          textStyle={{
            fontSize: 16,
            color: '#1F2937',
          }}
        />
      </View>

      {/* Type Dropdown */}
      <View className="mb-4 z-10">
        <Text className="text-base font-semibold text-gray-700 mb-1">Type</Text>
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
          setValue={(callback) =>
            setBranch((prev) => ({
              ...prev,
              type: callback(prev.type) as Branch["type"],
            }))
          }
          placeholder="Select Type"
          placeholderStyle={{ color: '#9CA3AF' }}
          style={{
            borderColor: '#D1D5DB',
            borderRadius: 12,
            backgroundColor: '#F9FAFB',
          }}
          dropDownContainerStyle={{
            borderColor: '#D1D5DB',
            backgroundColor: '#fff',
            borderRadius: 12,
          }}
          textStyle={{
            fontSize: 16,
            color: '#1F2937',
          }}
        />
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-between mt-8">
        <TouchableOpacity
          onPress={onCancel}
          className="flex-1 bg-gray-200 rounded-xl py-3 mr-2 items-center"
        >
          <Text className="text-gray-800 font-semibold text-base">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onSubmit(branch)}
          className="flex-1 bg-primary rounded-xl py-3 ml-2 items-center"
        >
          <Text className="text-white font-semibold text-base">Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserForm;
