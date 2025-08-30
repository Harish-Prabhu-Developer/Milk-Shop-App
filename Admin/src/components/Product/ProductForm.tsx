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
import DropDownPicker from 'react-native-dropdown-picker';
import {launchImageLibrary, launchCamera, ImageLibraryOptions} from 'react-native-image-picker';
import { API_URL } from '@env';

interface ProductFormProps {
  onClose: () => void;
  onSubmit: (product: Product) => void;
  initialValues?: Partial<Product>;
}

const ProductForm = ({ onClose, onSubmit, initialValues }: ProductFormProps) => {
  // Category Dropdown
  const [CategoryOpen, setCategoryOpen] = useState(false);
  const [CategoryValue, setCategoryValue] = useState<string | null>(null);
  const [CategoryItems, setCategoryItems] = useState([
    { label: 'Milk', value: 'milk' },
  ]);

  // Unit Measure Dropdown
  const [unitMeasureOpen, setUnitMeasureOpen] = useState(false);
  const [unitMeasureValue, setUnitMeasureValue] = useState<string | null>(null);
  const [unitMeasureItems, setUnitMeasureItems] = useState([
    { label: 'ml', value: 'ml' },
    { label: 'Litre', value: 'Litre' },
    { label: 'gm', value: 'gm' },
    { label: 'kg', value: 'kg' },
    { label: 'pcs', value: 'pcs' },
  ]);

  const [unitvalue,setUnitValue] =useState('');
  // nutrition units Measure Dropdown
  const [nutritionUnitOpen, setNutritionUnitOpen] = useState(false);
  const [nutritionUnitValue, setNutritionUnitValue] = useState<string | null>(null);
  const [nutritionUnitItems, setNutritionUnitItems] = useState([
    { label: 'g', value: 'g' },
    { label: 'mg', value: 'mg' },
    { label: 'kcal', value: 'kcal' },
  ]);
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


const handleImagePick = () => {
  Alert.alert(
    'Upload Image',
    'Choose an option',
    [
      { text: 'Camera', onPress: () => openCamera() },
      { text: 'Gallery', onPress: () => openGallery() },
      { text: 'Cancel', style: 'cancel' }
    ]
  );
};

const openGallery = () => {
  const options: ImageLibraryOptions = {
    mediaType: 'photo',
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.8,
  };
  launchImageLibrary(options, response => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorMessage) {
      console.log('Image Picker Error: ', response.errorMessage);
    } else if (response.assets && response.assets.length > 0) {
      const uri = response.assets[0].uri;
      if (uri) {
        setProduct(prev => ({ ...prev, image: uri }));
      }
    }
  });
};

const openCamera = () => {
  const options: ImageLibraryOptions = {
    mediaType: 'photo',
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.8,
  };
  launchCamera(options, response => {
    if (response.didCancel) {
      console.log('User cancelled camera');
    } else if (response.errorMessage) {
      console.log('Camera Error: ', response.errorMessage);
    } else if (response.assets && response.assets.length > 0) {
      const uri = response.assets[0].uri;
      if (uri) {
        setProduct(prev => ({ ...prev, image: uri }));
      }
    }
  });
};

  const [nutritionList, setNutritionList] = useState<{ label: string; value: string }[]>([]);
  const [nutritionLabel, setNutritionLabel] = useState('');
  const [nutritionAmount, setNutritionAmount] = useState('');
 
  
  useEffect(() => {
    console.log("API ",API_URL);
    
    if (initialValues) {
      setProduct({
        _id: initialValues._id || '',
        name: initialValues.name || '',
        price: initialValues.price ?? 0,
        unit: initialValues.unit || '',
        description: initialValues.description || '',
        nutrition: initialValues.nutrition || '',
        image: initialValues.image || '',
        isActive: initialValues.isActive ?? true,
      });

      setCategoryValue(initialValues.category || null);
      if (initialValues.unit) {
        const match = initialValues.unit.trim().match(/^(\d+(?:\.\d+)?)[\s]*([a-zA-Z]+)$/);

        if (match) {
          const [, numeric, measure] = match;
          setUnitMeasureValue(measure);
          setUnitValue(numeric);

        } else {
          console.warn('Unit format invalid:', initialValues.unit);
        }
      }

      setNutritionList(
        initialValues.nutrition
          ? initialValues.nutrition.split(',').map((item: string) => {
              const [label, value] = item.split(':');
              return { label: label.trim(), value: value.trim() };
            })
          : []
      );

    }
  }, [initialValues]);

  const handleChange = (key: keyof Product, value: any) => {
    setProduct({ ...product, [key]: value });
  };

const handleSubmit = () => {
  if (!product.name || !product.price || !unitvalue || !unitMeasureValue) {
    Alert.alert('Please fill in Name, Price, and Unit.');
    return;
  }

  const finalUnit = `${unitvalue}${unitMeasureValue}`;
  const nutritionString = nutritionList
    .filter(n => n.label && n.value)
    .map(n => `${n.label}: ${n.value}`)
    .join(', ');

  const finalProduct: Product = {
    _id: initialValues?._id||'',
    name: product.name.trim(),
    price: parseFloat(product.price.toString()),
    unit: finalUnit,
    description: product.description?.trim() || '',
    nutrition: nutritionString,
    image: product.image || '', // Ensure this is passed correctly
    category: CategoryValue || initialValues?.category || '',
    isActive: product.isActive ?? true,
  };

  console.log('Submitting Product:', finalProduct);
  onSubmit(finalProduct);
  onClose();
};


  const addNutritionItem = () => {
    if (nutritionLabel.trim() && nutritionAmount.trim()) {
      const combinedValue = `${nutritionAmount}${nutritionUnitValue}`;
      setNutritionList([...nutritionList, { label: nutritionLabel, value: combinedValue }]);
      setNutritionLabel('');
      setNutritionAmount('');
    }
  };

  const removeNutritionItem = (index: number) => {
    const updated = [...nutritionList];
    updated.splice(index, 1);
    setNutritionList(updated);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1"
    >
      <Text className="text-black font-bold text-2xl py-4">
        {initialValues ? 'Update Product' : 'Add Product'}
      </Text>

      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Product Image */}
        <TouchableOpacity
          onPress={handleImagePick}
          activeOpacity={0.8}
          className="items-center justify-center h-[180px] w-[60%] bg-gray-100 border-2 border-dashed border-gray-400 rounded-lg my-4 self-center"
        >
          {product.image && product.image.trim() !== "" ? (
            <Image
              source={{
                uri: product.image.startsWith("file://") || product.image.startsWith("ph://")
                  ? product.image // local image
                  : `${API_URL}/${product.image}` // server image
              }}
              className="w-full h-full rounded-lg bg-gray-200" // image itself has fallback background
              resizeMode="cover"
            />
          ) : (
            <View className="flex items-center justify-center h-full">
              <Text className="text-gray-500 text-sm">Tap to upload image</Text>
            </View>
          )}
        </TouchableOpacity>


        {/* Product Name */}
        <Text className="text-lg font-bold text-gray-800 py-4">Product Name</Text>
        <TextInput
          placeholder="e.g., Toned Milk"
          value={product.name}
          onChangeText={text => handleChange('name', text)}
          placeholderTextColor="gray"
          className="w-full border border-gray-800 px-4 py-4 rounded-lg text-lg text-gray-800"
        />

        {/* Price */}
        <Text className="text-lg font-bold text-gray-800 py-4">Price (₹) *</Text>
        <TextInput
          placeholder="e.g., 55"
          value={product.price?.toString()}
          keyboardType="numeric"
          onChangeText={text => handleChange('price', parseFloat(text)||0)}
          placeholderTextColor="gray"
          className="w-full border border-gray-800 px-4 py-4 rounded-lg text-lg text-gray-800"
        />

        {/* Unit */}
        <Text className="text-lg font-bold text-gray-800 py-4">Unit *</Text>
        <View className="flex-row gap-4 items-center justify-center space-x-4">
          <TextInput
            placeholder="e.g., 500"
            placeholderTextColor={'gray'}
            value={unitvalue} 
            onChangeText={setUnitValue}
            keyboardType="numeric"
            className="flex-1 border border-gray-800 px-4 py-4 rounded-lg text-gray-800"
          />
          <DropDownPicker
            open={unitMeasureOpen}
            setOpen={setUnitMeasureOpen}
            setItems={setUnitMeasureItems}
            value={unitMeasureValue}
            items={unitMeasureItems}
            placeholder='Select Unit'
            placeholderStyle={{color:'gray'}}
            setValue={(cb) => setUnitMeasureValue(cb)}
            containerStyle={{ width: 100 }}
            style={{ borderColor: '#4B5563' }}
            dropDownContainerStyle={{ borderColor: '#4B5563',}}
            listMode="SCROLLVIEW"
            dropDownDirection='TOP'
            zIndex={1000}
            zIndexInverse={1000}
          />
        </View>

        {/* Category */}
        <Text className="text-lg font-bold text-gray-800 py-4">Category</Text>
        <DropDownPicker
          open={CategoryOpen}
          value={CategoryValue}
          items={CategoryItems}
          setOpen={setCategoryOpen}
          setValue={setCategoryValue}
          onChangeValue={(val) => handleChange('category', val)}
          setItems={setCategoryItems}
          placeholder="Select Category"
          placeholderStyle={{color:'gray'}}
          listMode="SCROLLVIEW"
          zIndex={1000}
          zIndexInverse={1000}
        />

        {/* Description */}
        <Text className="text-lg font-bold text-gray-800 py-4">Description</Text>
        <TextInput
          placeholder="Short product description"
          value={product.description}
          placeholderTextColor={'gray'}
          onChangeText={text => handleChange('description', text)}
          multiline
          className="w-full border border-gray-800 px-4 py-4 rounded-lg text-gray-800"
        />

        {/* Nutrition */}
        <Text className="text-lg font-bold text-gray-800 py-3">Nutrition Info</Text>
        <View className="flex-row gap-2 space-x-2 my-2">
          <TextInput
            placeholder="e.g., Protein"
            placeholderTextColor={'gray'}
            value={nutritionLabel}
            onChangeText={setNutritionLabel}
            className="flex-1 border border-gray-800 px-3 py-2 rounded-lg text-gray-800"
          />
          <TextInput
            placeholder="e.g., 10"
            value={nutritionAmount}
            placeholderTextColor={'gray'}
            keyboardType="numeric"
            onChangeText={setNutritionAmount}
            className="w-[70px] border border-gray-800 px-3 py-2 rounded-lg text-gray-800"
          />
          <DropDownPicker
            open={nutritionUnitOpen}
            setOpen={setNutritionUnitOpen}
            value={nutritionUnitValue}
            setItems={setNutritionUnitItems}
            items={nutritionUnitItems}
            placeholder='unit'
            placeholderStyle={{color:'gray'}}
            setValue={(cb) => setNutritionUnitValue(cb(nutritionUnitValue))}
            containerStyle={{ width: '22%'}}
            style={{ borderColor: '#4B5563' }}
            dropDownContainerStyle={{ borderColor: '#4B5563' }}
            listMode="SCROLLVIEW"

          />
          <TouchableOpacity
            onPress={addNutritionItem}
            className="bg-primary px-4 py-2 rounded-lg justify-center"
          >
            <Text className="text-white font-bold">Add</Text>
          </TouchableOpacity>
        </View>

        {nutritionList.map((item, index) => (
          <View key={index} className="flex-row justify-between items-center my-2 border border-gray-900 px-4 py-2 rounded-lg">
            <Text className="text-gray-700">{item.label}: {item.value}</Text>
            <TouchableOpacity onPress={() => removeNutritionItem(index)}>
              <Text className="text-red-600 font-bold">Remove</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Active Toggle */}
        <View className="flex-row items-center justify-between my-4">
          <Text className="font-semibold text-gray-700 text-lg">Is Active?</Text>
          <Switch
            value={product.isActive}
            onValueChange={val => handleChange('isActive', val)}
          />
        </View>

        {/* Buttons */}
        <View className="flex-row justify-between mt-4">
          <TouchableOpacity className="bg-primary px-6 py-3 rounded-lg" onPress={handleSubmit}>
            <Text className="text-white font-bold text-lg">
              {initialValues ? 'Update' : 'Add'} Product
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} className="border border-primary px-6 py-3 rounded-lg">
            <Text className="text-primary font-bold text-lg">Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ProductForm;
