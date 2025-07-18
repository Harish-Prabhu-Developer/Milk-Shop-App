// UserScreen.tsx
import { ToastAndroid, View, Modal } from 'react-native';
import React, { useState } from 'react';
import Header from '../../components/Header';
import FloatingButton from '../../components/FloatingButton';
import { FlatList } from 'react-native-gesture-handler';
import UserCard from '../../components/User/UserCard';
import UserForm from '../../components/User/UserForm';
import { Branch } from '../../@types/User';

const UserScreen = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editData, setEditData] = useState<Branch | null>(null);

  const handleAdd = () => {
    setEditData(null);
    setModalVisible(true);
  };

  const handleSave = (data: Branch) => {
    if (editData) {
      setBranches((prev) => prev.map((b) => (b.id === editData.id ? data : b)));
    } else {
      setBranches((prev) => [...prev, { ...data, id: `${Date.now()}${Math.random() * 1000}`}]);
    }
    setModalVisible(false);
    ToastAndroid.show('User Saved', ToastAndroid.SHORT);
  };

  const handleEdit = (branch: Branch) => {
    setEditData(branch);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setBranches((prev) => prev.filter((b) => b.id !== id));
    ToastAndroid.show('User Deleted', ToastAndroid.SHORT);
  };

  return (
    <View className="flex-1 bg-white">
      <Header title={'Users'} />
      <FlatList
        data={branches}
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
      <Modal visible={modalVisible} animationType="slide">
        <UserForm
          initialData={editData || undefined}
          onSubmit={handleSave}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>
    </View>
  );
};

export default UserScreen;
