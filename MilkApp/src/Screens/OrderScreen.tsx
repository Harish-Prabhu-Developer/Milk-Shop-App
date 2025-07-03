import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { KeyboardAvoidingView } from 'react-native'
import HeaderSection from '../Components/Header/HeaderSection'

const OrderScreen = () => {
  return (
    <View className='flex-1 bg-white'>
      <StatusBar barStyle={'light-content'}/>
      {/* Header Section */}
      <KeyboardAvoidingView behavior="padding" className='sm:pt-safe-or-8'>
              <HeaderSection SearchBar={false}  />
      </KeyboardAvoidingView>

    </View>
  )
}

export default OrderScreen

const styles = StyleSheet.create({})