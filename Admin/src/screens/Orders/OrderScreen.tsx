import { View } from 'react-native'
import React from 'react'
import Header from '../../components/Header'

const OrderScreen = () => {
  return (
    <View className='flex-1 bg-white'>
      {/* Header */}
      <Header title={'Orders'} />
    </View>
  )
}

export default OrderScreen
