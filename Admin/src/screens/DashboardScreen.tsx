import { Image,Text, View } from 'react-native'
import React from 'react'
import Header from '../components/Header'

const DashboardScreen = () => {
  return (
    <View className='flex-1 bg-white'>

      {/* Header */}
      <Header title={'Dashboard'} />
    </View>
  )
}

export default DashboardScreen
