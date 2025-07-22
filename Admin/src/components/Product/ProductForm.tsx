// ProductForm.tsx
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Product } from '../../@types/Product';

interface ProductFormProps {
  onClose: () => void;
  onSubmit: (product: Product) => void;
  initialValues?: Partial<Product>; 
}


const ProductForm = ({ onClose, onSubmit, initialValues }: ProductFormProps) => {


const [product, setProduct] = useState<Partial<Product>>({
  name: '',
  price: 0,
  unit: '',
  description: '',
  nutrition: '',
  image: '',
  category: '',
  isActive: true,
});

useEffect(() => {
  if (initialValues) {
    setProduct({
      name: initialValues.name || '',
      price: initialValues.price ?? 0,
      unit: initialValues.unit || '',
      description: initialValues.description || '',
      nutrition: initialValues.nutrition || '',
      image: initialValues.image || '',
      category: initialValues.category || '',
      isActive: initialValues.isActive ?? true,
    });
  }
}, [initialValues]);


  const handleChange = (key: keyof Product, value: any) => {
    setProduct({ ...product, [key]: value });
  };

  const handleSubmit = () => {
    if (!product.name || !product.price || !product.unit) {
      Alert.alert('Please fill in name,price,unit required fields.');
      return;
    }

    onSubmit({
      id: Date.now().toString(),
      name: product.name!,
      price: Number(product.price),
      unit: product.unit!,
      description: product.description || '',
      nutrition: product.nutrition || '',
      image: product.image || '',
      category: product.category || '',
      isActive: product.isActive ?? true,
    }
  );

    onClose();
  };

  console.log("Product Form initialValues : ",initialValues);
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 "
    >
  <Text className="text-white font-bold text-lg">
    {initialValues ? 'Update Product' : 'Add Product'}
  </Text>


      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <TouchableOpacity
          // onPress={handleImagePick}
          activeOpacity={0.8}
          className="items-center justify-center h-[180px] w-[60%] bg-gray-100 border-2 border-dashed border-gray-400 rounded-lg my-4 self-center"
        >
          {typeof product.image === 'string' && product.image.trim() !== '' ? (
            <Image
              source={{ uri: product.image }}
              className="w-full h-full rounded-md"
              resizeMode="cover"
            />
          ) : (
            <View className="flex items-center justify-center h-full">
              <Text className="text-gray-500 text-sm">Tap to upload image</Text>
            </View>
          )}

        </TouchableOpacity>

        {/* Product Name */}
        <Text className="text-lg font-bold text-gray-800 py-4">
          Product Name
        </Text>
        <TextInput
          placeholder="e.g., Toned Milk"
          value={product.name}
          onChangeText={text => handleChange('name', text)}
          placeholderTextColor={'gray'}
          className="w-full border border-gray-800 px-4 py-4 rounded-lg text-lg text-gray-800"
        />

        {/* Product Price */}
        <Text className="text-lg font-bold text-gray-800 py-4">
          Price (₹) *
        </Text>
        <TextInput
          placeholder="e.g., 55"
          value={product.price?.toString()}
          keyboardType="numeric"
          onChangeText={text => handleChange('price', parseFloat(text))}
          placeholderTextColor={'gray'}
          className="w-full border border-gray-800 px-4 py-4 rounded-lg text-lg text-gray-800"
        />

        {/* Unit */}
        <Text className="text-lg font-bold text-gray-800 py-4">Unit *</Text>
        <TextInput
          placeholder="e.g., 1L, 500g"
          value={product.unit}
          onChangeText={text => handleChange('unit', text)}
          placeholderTextColor={'gray'}
          className="w-full border border-gray-800 px-4 py-4 rounded-lg text-lg text-gray-800"
        />

        {/* Category */}
        <Text className="text-lg font-bold text-gray-800 py-4">Category</Text>
        <TextInput
          placeholder="e.g., Milk, Curd, Paneer"
          value={product.category}
          onChangeText={text => handleChange('category', text)}
          placeholderTextColor={'gray'}
          className="w-full border border-gray-800 px-4 py-4 rounded-lg text-lg text-gray-800"
        />

        {/* Description */}
        <Text className="text-lg font-bold text-gray-800 py-4">
          Description
        </Text>
        <TextInput
          placeholder="Short product description"
          value={product.description}
          onChangeText={text => handleChange('description', text)}
          multiline
          placeholderTextColor={'gray'}
          className="w-full border border-gray-800 px-4 py-4 rounded-lg text-lg text-gray-800"
        />

        {/* Nutrition */}
        <Text className="text-lg font-bold text-gray-800 py-4">
          Nutritional Info
        </Text>
        <TextInput
          placeholder="Calories, Protein, Fat etc."
          value={product.nutrition}
          onChangeText={text => handleChange('nutrition', text)}
          multiline
          placeholderTextColor={'gray'}
          className="w-full border border-gray-800 px-4 py-4 rounded-lg text-lg text-gray-800"
        />
        {/* Active Toggle */}
        <View className="flex-row items-center justify-between my-4">
          <Text className="font-semibold text-gray-700 text-lg">
            Is Active?
          </Text>
          <Switch
            value={product.isActive}
            onValueChange={val => handleChange('isActive', val)}
          />
        </View>

        {/* Buttons */}
        <View className="flex-row justify-between">
          <TouchableOpacity
            className="bg-primary px-6 py-3 rounded-lg"
            onPress={handleSubmit}
          >
            <Text className="text-white font-bold text-lg">Add Product</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            className="border border-primary px-6 py-3 rounded-lg"
          >
            <Text className="text-primary font-bold text-lg">Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ProductForm;
