// ProductScreen.tsx
import { FlatList, Modal, Text, View } from 'react-native'
import React, { useState } from 'react'
import Header from '../../components/Header'
import FloatingButton from '../../components/FloatingButton'
import ProductForm from '../../components/Product/ProductForm'
import ProductCard from '../../components/Product/ProductCard'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { Product } from '../../@types/Product'

const ProductScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const dispatch = useDispatch<AppDispatch>();
  const products:Product = useSelector((state:any) => state.product.products);

  return (
    <View className='flex-1 bg-white'>
      {/* Header */}
      <Header title={'Products'} />
      <FlatList
        data={[1,2,3,4,5]}
        renderItem={({item, index})=>(
          <ProductCard
            key={index}
            product={products}
            // onPress={() => navigation.navigate('ProductDetailScreen',{Product: products[index]})}
            onEdit={(p) => console.log('Product Card Edit Pressed : ',p)}
            onDelete={(id) => console.log('Product Card Delete Pressed : ',id)}
          />
        )}

      />

      {/* Floating Button */}
      <FloatingButton onPress={()=>{
        setModalVisible(true);
      }}/>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 bg-black/40 justify-end">
          <View className="flex-1 bg-white p-4">
            <ProductForm onClose={()=>setModalVisible(false)} onSubmit={(Product)=>console.log('Product : ', Product)}/>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default ProductScreen
