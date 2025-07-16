import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../../components/Header'

const ProductScreen = () => {
  return (
    <View className='flex-1 bg-white'>
      <StatusBar barStyle={'light-content'} />
      {/* Header */}
      <Header title={'Products'} />
    </View>
  )
}

export default ProductScreen

const styles = StyleSheet.create({})