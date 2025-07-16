import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { StatusBar } from 'react-native'
import Header from '../components/Header'

const DashboardScreen = () => {
  return (
    <View className='flex-1 bg-white'>
      <StatusBar barStyle={'light-content'} />
      {/* Header */}
      <Header title={'Dashboard'} />
    </View>
  )
}

export default DashboardScreen

const styles = StyleSheet.create({})