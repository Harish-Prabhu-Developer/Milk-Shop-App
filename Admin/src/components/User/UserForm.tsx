import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
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
      _id: '',
      branchName: '',
      phone: '',
      email: '',
      address: '',
      password: 'branch@123',
      location: '',
      routeName: '',
      role: 'user',
      type: 'NKC Local',
    },
  );
  const [showPassword, setShowPassword] = useState(false);
  const PlaceDetails: Place[] = useSelector(
    (state: RootState) => state.place.places,
  );
  useEffect(() => {
    console.log('PlaceDetails:', PlaceDetails);
  }, []);

  const [openBranch, setOpenBranch] = useState(false);
  const [openRoute, setOpenRoute] = useState(false);
  const [openType, setOpenType] = useState(false);
  const [openRole, setOpenRole] = useState(false);

  const handleChange = (key: keyof Branch, value: string) => {
    setBranch({ ...branch, [key]: value });
  };
  const validateEmail = (email: string) => {
    const EMAILPATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return EMAILPATTERN.test(email);
  };

  const handleSubmit = () => {
    if (!validateEmail(branch.email)) {
      return Alert.alert('Please enter a valid email address.');
    }
    if (
      branch.branchName &&
      branch.phone &&
      branch.email &&
      branch.location &&
      branch.routeName === ''
    ) {
      return Alert.alert('Please fill in all required fields.');
    }
      onSubmit(branch);
  };
  const requiredFieldsstar = () => {
    return <Text className="text-red-500 font-bold">*</Text>;
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="bg-white rounded-2xl mt-6 p-4"
    >
      <Text className="text-2xl font-bold text-gray-800">Branch Details</Text>
      <ScrollView keyboardShouldPersistTaps="handled">
        {/* Route Name Dropdown */}
        <View className="mb-2 z-20">
          <Text className="text-lg font-semibold text-gray-700 my-2">
            Branch Name {requiredFieldsstar()}
          </Text>
          <DropDownPicker
            open={openBranch}
            value={branch.branchName}
            items={PlaceDetails.flatMap(P =>
              P.Route.map(R => ({
                label: R['Branch Name'],
                value: R['Branch Name'],
              })),
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
        <View className="mb-2">
          <Text className="text-lg font-semibold text-gray-700 my-2">
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
        {/* Address */}
        <View className="mb-2">
          <Text className="text-lg font-semibold text-gray-700 my-2">
            Address (Optional)
          </Text>
          <TextInput
            placeholder="e.g., 123 Main St, Anytown, USA"
            value={branch.address}
            onChangeText={text => handleChange('address', text)}
            className="w-full border border-gray-800 px-4 py-4 rounded-lg text-lg text-gray-800"
            placeholderTextColor="gray"
          />
        </View>
        {/* Type Dropdown */}
        <View className="mb-2 z-10">
          <Text className="text-lg font-semibold text-gray-700 my-2">Type</Text>
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
            dropDownDirection="AUTO"
          />
        </View>
        {/* Phone */}
        <View className="mb-2">
          <Text className="text-lg font-semibold text-gray-700 my-2">
            Phone Number {requiredFieldsstar()}
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
        <View className="mb-2">
          <Text className="text-lg font-semibold text-gray-700 my-2">
            Location {requiredFieldsstar()}
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
        <View className="mb-2 z-20">
          <Text className="text-lg font-semibold text-gray-700 my-2">
            Route Name
          </Text>
          <DropDownPicker
            open={openRoute}
            value={branch.routeName}
            items={PlaceDetails.flatMap(P =>
              P.Route.map(R => ({
                label: R['Branch Name'],
                value: R['Branch Name'],
              })),
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

        {/* Email */}
        <View className="mb-2">
          <Text className="text-lg font-semibold text-gray-700 my-2">
            Email {requiredFieldsstar()}
          </Text>
          <TextInput
            placeholder="e.g., name@example.com"
            value={branch.email}
            onChangeText={text => handleChange('email', text)}
            className="w-full border border-gray-800 px-4 py-4 rounded-lg text-lg text-gray-800"
            placeholderTextColor="gray"
          />
        </View>
        {/* Role Dropdown */}
        <View className="mb-2 z-20">
          <Text className="text-lg font-semibold text-gray-700 my-2">Role</Text>
          <DropDownPicker
            open={openRole}
            value={branch.role ? branch.role : 'user'}
            items={[
              { label: 'User', value: 'user' },
              { label: 'Admin', value: 'admin' },
            ]}
            setOpen={setOpenRole}
            setValue={callback =>
              setBranch(prev => ({
                ...prev,
                role: callback(prev.role) as Branch['role'],
              }))
            }
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
        <View className="flex-row w-full items-center justify-around gap-4 mt-4 mb-2">
          <TouchableOpacity
            onPress={onCancel}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UserForm;
