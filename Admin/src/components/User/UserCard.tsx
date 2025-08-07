// UserCard.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Branch } from '../../@types/User';
import { formatDate } from '../../utils/CustomFunctions/DateFunctions';

interface UserCardProps {
  branch: Branch;
  onEdit: () => void;
  onDelete: () => void;
}
type keyValueStyleProps={
  key:string;
  value:string;

}
const UserCard = ({ branch, onEdit, onDelete }: UserCardProps) => {
  const keyValueStyle = ({key, value}:keyValueStyleProps) => {
    return (
      <View className='flex-row items-center gap-2'>
        <Text className='font-semibold'>{key}:</Text>
        <Text>{value}</Text>
      </View>
    );
  };
  return (
    <View className='flex-row items-center justify-between rounded-lg border border-gray-300 shadow-md p-4 bg-white gap-2'>
      
      <View className='flex gap-1'>
          <Text className='text-lg text-primary font-semibold'>{branch.branchName}</Text>
          {branch.contactPerson&&keyValueStyle({key: 'Contact Person', value: branch.contactPerson})}
          {keyValueStyle({key: 'Phone', value: branch.phone})}
          {keyValueStyle({key: 'Location', value: branch.location})}
          {keyValueStyle({key: 'Route Name', value: branch.routeName})}
          {keyValueStyle({key: 'Type', value: branch.type})}
          {branch.registeredDate && keyValueStyle({key: 'Registered Date', value: formatDate(branch.registeredDate)})}

          <View className='my-2' >
            {branch.address && (
                            <View className='border border-gray-300 bg-gray-200 p-2 rounded-lg'>
                <Text className='font-semibold'>Address</Text>
                <Text className='text-gray-600'>{`${branch?.address?.split(',').join(',\n').trim()}`}</Text>
            </View>
            )}
          </View>
      </View>
      <View className='flex-row items-start gap-4 justify-end '>
        <TouchableOpacity onPress={onEdit} className='border border-blue-500 p-2 rounded-lg'>
          <MaterialIcons name="edit" size={18} color="#3b82f6" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} className='border border-red-500 p-2 rounded-lg' >
          <MaterialIcons name="delete" size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>    
  );
};

export default UserCard;
