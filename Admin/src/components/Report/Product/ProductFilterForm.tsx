// ProductFilterForm.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Ionicons from "react-native-vector-icons/Ionicons";

type ProductFilterFormProps = {
  products: any[];
  setFilteredData: (data: any[]) => void;
  closeModal: () => void;
};

const ProductFilterForm = ({ products, setFilteredData, closeModal }: ProductFilterFormProps) => {
  // filters
  const [filters, setFilters] = useState({
    name: null,
    category: null,
    unit: null,
    totalMin: "",
    totalMax: "",
  });

  // dropdown states
  const [nameOpen, setNameOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [unitOpen, setUnitOpen] = useState(false);

  // unique dropdown items
  const names = [
    ...new Map(
      products.map((p) => [
        p.name,
        { label: p.name, value: p.name },
      ])
    ).values(),
  ];

  const categories = [
    ...new Map(
      products.map((p) => [
        p.category,
        { label: p.category, value: p.category },
      ])
    ).values(),
  ];

  const units = [
    ...new Map(
      products.map((p) => [
        p.unit,
        { label: p.unit, value: p.unit },
      ])
    ).values(),
  ];

  // update helper
  const updateFilter = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // clear filter
  const handleClear = () => {
    setFilters({
      name: null,
      category: null,
      unit: null,
      totalMin: "",
      totalMax: "",
    });
    setFilteredData(products);
    closeModal();
  };

  // apply filter
  const applyFilter = () => {
    let filtered = [...products];

    if (filters.name) {
      filtered = filtered.filter((p) => p.name === filters.name);
    }
    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }
    if (filters.unit) {
      filtered = filtered.filter((p) => p.unit === filters.unit);
    }
    if (filters.totalMin) {
      filtered = filtered.filter((p) => Number(p.price) >= Number(filters.totalMin));
    }
    if (filters.totalMax) {
      filtered = filtered.filter((p) => Number(p.price) <= Number(filters.totalMax));
    }

    setFilteredData(filtered);
    closeModal();
  };

  return (
    <View className="bg-white rounded-t-3xl p-5 max-h-[80%]">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-xl font-bold text-gray-800">Filter Products</Text>
        <TouchableOpacity onPress={closeModal}>
          <Ionicons name="close-circle" size={28} color="#dc2626" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Name */}
        <View style={{ zIndex: 4000 }} className="mb-4">
          <DropDownPicker
            listMode="SCROLLVIEW"
            open={nameOpen}
            value={filters.name}
            items={names}
            setOpen={setNameOpen}
            setValue={(cb) => updateFilter("name", cb(filters.name))}
            setItems={() => {}}
            placeholder="Select Name"
          />
        </View>

        {/* Category */}
        <View style={{ zIndex: 3000 }} className="mb-4">
          <DropDownPicker
            listMode="SCROLLVIEW"
            open={categoryOpen}
            value={filters.category}
            items={categories}
            setOpen={setCategoryOpen}
            setValue={(cb) => updateFilter("category", cb(filters.category))}
            setItems={() => {}}
            placeholder="Select Category"
          />
        </View>

        {/* Unit */}
        <View style={{ zIndex: 2000 }} className="mb-4">
          <DropDownPicker
            listMode="SCROLLVIEW"
            open={unitOpen}
            value={filters.unit}
            items={units}
            setOpen={setUnitOpen}
            setValue={(cb) => updateFilter("unit", cb(filters.unit))}
            setItems={() => {}}
            placeholder="Select Unit"
          />
        </View>

        {/* Price Range */}
        <View className="flex-row gap-3 mb-4">
          <TextInput
            placeholder="Min Price"
            placeholderTextColor="gray"
            value={filters.totalMin}
            keyboardType="numeric"
            onChangeText={(text) => updateFilter("totalMin", text)}
            className="flex-1 border border-gray-800 px-4 py-4 rounded-lg text-gray-800"
          />
          <TextInput
            placeholder="Max Price"
            placeholderTextColor="gray"
            value={filters.totalMax}
            keyboardType="numeric"
            onChangeText={(text) => updateFilter("totalMax", text)}
            className="flex-1 border border-gray-800 px-4 py-4 rounded-lg text-gray-800"
          />
        </View>

        {/* Buttons */}
        <View className="flex-row justify-between gap-4 mt-2">
          <TouchableOpacity
            onPress={handleClear}
            className="flex-1 border border-primary bg-white rounded-lg py-3"
          >
            <Text className="text-center text-lg font-bold text-primary">
              Clear
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={applyFilter}
            className="flex-1 bg-primary py-3 rounded-lg items-center shadow-lg"
          >
            <Text className="text-lg font-bold text-white">Apply</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductFilterForm;
