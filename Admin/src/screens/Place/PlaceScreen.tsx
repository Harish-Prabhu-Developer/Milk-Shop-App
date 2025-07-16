import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../../components/Header'
import { StatusBar } from 'react-native'

const PlaceScreen = () => {
  return (
    <View className='flex-1 bg-white'>
      <StatusBar barStyle={'light-content'} />
      {/* Header */}
      <Header title={'Delivery Places'} />
    </View>
  )
}

export default PlaceScreen

const styles = StyleSheet.create({})