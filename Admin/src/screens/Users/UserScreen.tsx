// UserScreen.tsx
import {
  ToastAndroid,
  View,
  Modal,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Header from '../../components/Header';
import FloatingButton from '../../components/FloatingButton';
import { FlatList } from 'react-native-gesture-handler';
import UserCard from '../../components/User/UserCard';
import UserForm from '../../components/User/UserForm';
import { Branch } from '../../@types/User';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { deleteBranch, fetchBranch, newBranch, updateBranch } from '../../redux/slices/userSlice';
import { Text } from 'react-native';

const UserScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [modalVisible, setModalVisible] = useState(false);
  const [editData, setEditData] = useState<Branch | null>(null);
  const BranchData: Branch[] = useSelector(
    (state: RootState) => state.user.users,
  );

  const { loading, error } = useSelector((state: RootState) => state.user);
  const [isloading, setisLoading] = useState(loading);
  const fetchUsersData = async () => {
    try {
      setisLoading(true);
      await dispatch(fetchBranch());
      await new Promise(resolve => setTimeout(resolve, 1000)); // simulate delay
    } catch (error) {
      console.log('Error fetching Branchs:', error);
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersData();
    console.log('Branchs : ', BranchData);
  }, []);

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUsersData();
    setRefreshing(false);
  }, []);

  const handleAdd = () => {
    setEditData(null);
    setModalVisible(true);
  };

  const handleSave = async (data: Branch) => {
    if (editData) {
      console.log(data);
      // destructure to remove _id
      const { _id, ...rest } = data;

      const updatedataBranch = {
        id: _id, // keep id separately
        data: rest, // everything except _id
      };
      console.log('updatedataBranch : ', updatedataBranch);

      const res =await dispatch(updateBranch(data));
      if (res.payload.msg === 'Branch updated successfully') {
        ToastAndroid.show('User Edited', ToastAndroid.SHORT);
      } else {
        ToastAndroid.show('Edit Failed', ToastAndroid.SHORT);
      }
    } else {
        const res =await dispatch(newBranch(data));
        if (res.payload.msg === 'Branch added successfully') {
        ToastAndroid.show('User Added', ToastAndroid.SHORT);
      } else {
        ToastAndroid.show('Add Failed', ToastAndroid.SHORT);
        }
    }
    setModalVisible(false);
  };

  const handleEdit = (branch: Branch) => {
    setEditData(branch);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    const res = await dispatch(deleteBranch(id));
    if(res.payload.msg === 'Branch deleted successfully'){
      ToastAndroid.show('User Deleted', ToastAndroid.SHORT);
    }else{
      ToastAndroid.show('Delete Failed', ToastAndroid.SHORT);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Header title={'Users'} />
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4B5563" />
          <Text className="mt-2 text-gray-700">Loading Users...</Text>
        </View>
      ) : BranchData.length <= 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="mt-2 text-gray-700">No Users Found</Text>
        </View>
      ) : (
        <FlatList
          data={BranchData}
          keyExtractor={item => item._id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <UserCard
              branch={item}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDelete(item._id)}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
      <FloatingButton onPress={handleAdd} />
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-end bg-black/50 bg-opacity-50">
          <UserForm
            initialData={editData || undefined}
            onSubmit={handleSave}
            onCancel={() => setModalVisible(false)}
          />
        </View>
      </Modal>
    </View>
  );
};

export default UserScreen;
