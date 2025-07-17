import { ToastAndroid, View } from 'react-native';
import React from 'react';
import Header from '../../components/Header';
import FloatingButton from '../../components/FloatingButton';
import { FlatList } from 'react-native-gesture-handler';
import UserCard from '../../components/User/UserCard';
const UserScreen = () => {
  return (
    <View className="flex-1 bg-white">      
      {/* Header */}
      <Header title={'Users'} />
      {/* Users List */}
      <FlatList
        data={[1, 2, 3, 4, 5]}
        renderItem={({ item, index }) => (
          <UserCard
            key={index.toString()}
          />
        )}
      />
      {/* Floating Button */}
      <FloatingButton
        onPress={() => ToastAndroid.show('Add User', ToastAndroid.SHORT)}
      />
    </View>
  );
};

export default UserScreen;
