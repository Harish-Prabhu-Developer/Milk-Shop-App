import { StatusBar, StyleSheet, ToastAndroid,View } from 'react-native'
import React, { useEffect } from 'react'
import Header from '../../components/Header'
import FloatingButton from '../../components/FloatingButton'
import { FlatList } from 'react-native-gesture-handler'
import UserCard from '../../components/User/Card/UserCard'
const UserScreen = () => {
  return (
    <View className='flex-1 bg-white'>
      <StatusBar barStyle={'light-content'} />
      {/* Header */}
      <Header title={'Users'} />
      {/* Users List */}
      <FlatList
        data={[1,2,3,4,5]}
        renderItem={({item,index}) => (
          <UserCard branch='Branch A' name='John Doe' role='Admin' email='zVvHt@example.com' key={index.toString()} />
        )}
      />



      {/* Floating Button */}
      <FloatingButton onPress={() => ToastAndroid.show('Add User', ToastAndroid.SHORT)}/>
    </View>
  )
}

export default UserScreen

const styles = StyleSheet.create({})