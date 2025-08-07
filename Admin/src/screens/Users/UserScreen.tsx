// UserScreen.tsx
import { ToastAndroid, View, Modal } from 'react-native';
import React, { useState } from 'react';
import Header from '../../components/Header';
import FloatingButton from '../../components/FloatingButton';
import { FlatList } from 'react-native-gesture-handler';
import UserCard from '../../components/User/UserCard';
import UserForm from '../../components/User/UserForm';
import { Branch } from '../../@types/User';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { addUser, editUser, removeUser } from '../../redux/slices/userSlice';

const UserScreen = () => {
  const dispatch=useDispatch<AppDispatch>();
  const [modalVisible, setModalVisible] = useState(false);
  const [editData, setEditData] = useState<Branch | null>(null);
  const BranchData:Branch[]=useSelector((state:RootState)=>state.user.users);
  const handleAdd = () => {
    setEditData(null);
    setModalVisible(true);
  };

  const handleSave =async (data: Branch) => {
    if (editData) {
      const res =await dispatch(editUser(data));
      if (res.type==='user/editUser') {
        ToastAndroid.show('User Edited', ToastAndroid.SHORT);        
      } else {
        ToastAndroid.show('Edit Failed', ToastAndroid.SHORT);
      }
    } else {
        const res =await dispatch(addUser(data));
        if (res.type==='user/addUser') {
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

  const handleDelete = async(id: string) => {
    const res = await dispatch(removeUser(id));
    if(res.type==="user/removeUser"){
      ToastAndroid.show('User Deleted', ToastAndroid.SHORT);
    }else{

    }
    
  };

  return (
    <View className="flex-1 bg-white">
      <Header title={'Users'} />
      <FlatList
        data={BranchData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <UserCard
            branch={item}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
      />
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
