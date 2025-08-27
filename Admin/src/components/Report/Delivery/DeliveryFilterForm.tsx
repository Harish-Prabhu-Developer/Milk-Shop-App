// DeliveryFilterForm.tsx
import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import Ionicons from "react-native-vector-icons/Ionicons";

interface DeliveryFilterFormProps {
  deliveries: any[];
  setFilteredData: (data: any[]) => void;
  closeModal: () => void;
}

const DeliveryFilterForm = ({
  deliveries,
  setFilteredData,
  closeModal,
}: DeliveryFilterFormProps) => {
  // filters
  const [filters, setFilters] = useState({
    routeGroup: null,
    vehicleType: null,
    branchName: null,
    orderStatus: null,
    totalMin: "",
    totalMax: "",
  });

  // dropdown states
  const [routeOpen, setRouteOpen] = useState(false);
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [branchOpen, setBranchOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  // unique dropdown items
  const routeGroups = [
    ...new Map(
      deliveries.map((d) => [d.routeGroup, { label: d.routeGroup, value: d.routeGroup }])
    ).values(),
  ];

  const vehicleTypes = [
    ...new Map(
      deliveries.map((d) => [d.vehicleType, { label: d.vehicleType, value: d.vehicleType }])
    ).values(),
  ];

  const branches = [
    ...new Map(
      deliveries.map((d) => [d.branchName, { label: d.branchName, value: d.branchName }])
    ).values(),
  ];

  const statuses = [
    ...new Map(
      deliveries.map((d) => [d.orderStatus, { label: d.orderStatus, value: d.orderStatus }])
    ).values(),
  ];

  // update helper
  const updateFilter = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // clear filter
  const handleClear = () => {
    setFilters({
      routeGroup: null,
      vehicleType: null,
      branchName: null,
      orderStatus: null,
      totalMin: "",
      totalMax: "",
    });
    setFilteredData(deliveries);
    closeModal();
  };

  // apply filter
  const applyFilter = () => {
    let filtered = [...deliveries];

    if (filters.routeGroup) {
      filtered = filtered.filter((d) => d.routeGroup === filters.routeGroup);
    }
    if (filters.vehicleType) {
      filtered = filtered.filter((d) => d.vehicleType === filters.vehicleType);
    }
    if (filters.branchName) {
      filtered = filtered.filter((d) => d.branchName === filters.branchName);
    }
    if (filters.orderStatus) {
      filtered = filtered.filter((d) => d.orderStatus === filters.orderStatus);
    }
    if (filters.totalMin) {
      filtered = filtered.filter((d) => Number(d.totalAmount) >= Number(filters.totalMin));
    }
    if (filters.totalMax) {
      filtered = filtered.filter((d) => Number(d.totalAmount) <= Number(filters.totalMax));
    }

    setFilteredData(filtered);
    closeModal();
  };

  return (
    <View className="bg-white rounded-t-3xl p-5 max-h-[80%]">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-xl font-bold text-gray-800">Filter Deliveries</Text>
        <TouchableOpacity onPress={closeModal}>
          <Ionicons name="close-circle" size={28} color="#dc2626" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Route Group */}
        <View style={{ zIndex: 4000 }} className="mb-4">
          <DropDownPicker
            listMode="SCROLLVIEW"
            open={routeOpen}
            value={filters.routeGroup}
            items={routeGroups}
            setOpen={setRouteOpen}
            setValue={(cb) => updateFilter("routeGroup", cb(filters.routeGroup))}
            setItems={() => {}}
            placeholder="Select Route Group"
          />
        </View>

        {/* Vehicle Type */}
        <View style={{ zIndex: 3000 }} className="mb-4">
          <DropDownPicker
            listMode="SCROLLVIEW"
            open={vehicleOpen}
            value={filters.vehicleType}
            items={vehicleTypes}
            setOpen={setVehicleOpen}
            setValue={(cb) => updateFilter("vehicleType", cb(filters.vehicleType))}
            setItems={() => {}}
            placeholder="Select Vehicle Type"
          />
        </View>

        {/* Branch */}
        <View style={{ zIndex: 2000 }} className="mb-4">
          <DropDownPicker
            listMode="SCROLLVIEW"
            open={branchOpen}
            value={filters.branchName}
            items={branches}
            setOpen={setBranchOpen}
            setValue={(cb) => updateFilter("branchName", cb(filters.branchName))}
            setItems={() => {}}
            placeholder="Select Branch"
          />
        </View>

        {/* Order Status */}
        <View style={{ zIndex: 1000 }} className="mb-4">
          <DropDownPicker
            listMode="SCROLLVIEW"
            open={statusOpen}
            value={filters.orderStatus}
            items={statuses}
            setOpen={setStatusOpen}
            setValue={(cb) => updateFilter("orderStatus", cb(filters.orderStatus))}
            setItems={() => {}}
            placeholder="Select Order Status"
          />
        </View>

        {/* Total Amount Range */}
        <View className="flex-row gap-3 mb-4">
          <TextInput
            placeholder="Min Amount"
            placeholderTextColor="gray"
            value={filters.totalMin}
            keyboardType="numeric"
            onChangeText={(text) => updateFilter("totalMin", text)}
            className="flex-1 border border-gray-800 px-4 py-4 rounded-lg text-gray-800"
          />
          <TextInput
            placeholder="Max Amount"
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

export default DeliveryFilterForm;
