
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import DatePicker from "react-native-date-picker";
import Ionicons from "react-native-vector-icons/Ionicons";

interface SalesFilterFormProps {
  filters: any;
  updateFilter: (key: string, value: string) => void;
  applyFilter: () => void;
  closeModal: () => void;
  routeNames: { label: string; value: string }[];
  routeTypes: { label: string; value: string }[];
  paidOptions: { label: string; value: string }[];
  branches: { label: string; value: string }[];
}

const SalesFilterForm: React.FC<SalesFilterFormProps> = ({
  filters,
  updateFilter,
  applyFilter,
  closeModal,
  routeNames,
  routeTypes,
  branches,
  paidOptions,
}) => {
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  const [routeNameOpen, setRouteNameOpen] = useState(false);
  const [routeTypeOpen, setRouteTypeOpen] = useState(false);
  const [paidOpen, setPaidOpen] = useState(false);
  const [branchNameOpen, setBranchNameOpen] = useState(false);

  const handleClear = () => {
    updateFilter("routeName", "");
    updateFilter("routeType", "");
    updateFilter("paidStatus", "All");
    updateFilter("branchName", "");
    updateFilter("startDate", "");
    updateFilter("endDate", "");
    updateFilter("priceMin", "");
    updateFilter("priceMax", "");
    updateFilter("totalMin", "");
    updateFilter("totalMax", "");
    updateFilter("literMin", "");
    updateFilter("literMax", "");
  };

  return (
    <View className="bg-white rounded-t-3xl p-5 max-h-[80%]">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-xl font-bold text-gray-800">Filter Sales</Text>
        <TouchableOpacity onPress={closeModal}>
          <Ionicons name="close-circle" size={28} color="#dc2626" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Route Name */}
        <View style={{ zIndex: 4000, position: "relative" }} className="mb-4">
          <DropDownPicker
            open={routeNameOpen}
            value={filters.routeName}
            items={routeNames}
            setOpen={setRouteNameOpen}
            setValue={(callback) =>
              updateFilter("routeName", callback(filters.routeName))
            }
            setItems={() => {}}
            listMode="SCROLLVIEW"
            placeholder="Select Route Name"
            style={{ borderColor: "#1f2937" }}
            dropDownContainerStyle={{ borderColor: "#1f2937" }}
          />
        </View>

        {/* Price Range */}
        <View className="flex-row gap-3 mb-4">
          <TextInput
            placeholder="Min Price"
            placeholderTextColor="gray"
            value={filters.priceMin}
            keyboardType="numeric"
            onChangeText={(text) => updateFilter("priceMin", text)}
            className="flex-1 border border-gray-800 px-4 py-4 rounded-lg text-gray-800"
          />
          <TextInput
            placeholder="Max Price"
            placeholderTextColor="gray"
            value={filters.priceMax}
            keyboardType="numeric"
            onChangeText={(text) => updateFilter("priceMax", text)}
            className="flex-1 border border-gray-800 px-4 py-4 rounded-lg text-gray-800"
          />
        </View>

        {/* Route Type */}
        <View style={{ zIndex: 3000, position: "relative" }} className="mb-4">
          <DropDownPicker
            open={routeTypeOpen}
            value={filters.routeType}
            items={routeTypes}
            setOpen={setRouteTypeOpen}
            setValue={(callback) =>
              updateFilter("routeType", callback(filters.routeType))
            }
            setItems={() => {}}
            listMode="SCROLLVIEW"
            placeholder="Select Route Type"
            style={{ borderColor: "#1f2937" }}
            dropDownContainerStyle={{ borderColor: "#1f2937" }}
          />
        </View>

        {/* Start Date */}
        <TouchableOpacity
          onPress={() => setOpenStart(true)}
          className="border border-gray-800 px-4 py-4 rounded-lg mb-4"
        >
          <Text className="text-gray-600">
            {filters.startDate ? filters.startDate : "Select Start Date"}
          </Text>
        </TouchableOpacity>
        <DatePicker
          modal
          mode="date"
          open={openStart}
          date={filters.startDate ? new Date(filters.startDate) : new Date()}
          onConfirm={(date) => {
            setOpenStart(false);
            updateFilter("startDate", date.toISOString().split("T")[0]);
          }}
          onCancel={() => setOpenStart(false)}
        />

        {/* End Date */}
        <TouchableOpacity
          onPress={() => setOpenEnd(true)}
          className="border border-gray-800 px-4 py-4 rounded-lg mb-4"
        >
          <Text className="text-gray-600">
            {filters.endDate ? filters.endDate : "Select End Date"}
          </Text>
        </TouchableOpacity>
        <DatePicker
          modal
          mode="date"
          open={openEnd}
          date={filters.endDate ? new Date(filters.endDate) : new Date()}
          onConfirm={(date) => {
            setOpenEnd(false);
            updateFilter("endDate", date.toISOString().split("T")[0]);
          }}
          onCancel={() => setOpenEnd(false)}
        />

        {/* Branch */}
        <View style={{ zIndex: 2000, position: "relative" }} className="mb-4">
          <DropDownPicker
            open={branchNameOpen}
            value={filters.branchName}
            items={branches}
            setOpen={setBranchNameOpen}
            setValue={(callback) =>
              updateFilter("branchName", callback(filters.branchName))
            }
            setItems={() => {}}
            placeholder="Select Branch Name"
            style={{ borderColor: "#1f2937" }}
            listMode="SCROLLVIEW"
            dropDownDirection="TOP"
            dropDownContainerStyle={{ borderColor: "#1f2937" }}
          />
        </View>

        {/* Liter Range */}
        <View className="flex-row gap-3 mb-4">
          <TextInput
            placeholder="Min Liter"
            placeholderTextColor="gray"
            value={filters.literMin}
            keyboardType="numeric"
            onChangeText={(text) => updateFilter("literMin", text)}
            className="flex-1 border border-gray-800 px-4 py-4 rounded-lg text-gray-800"
          />
          <TextInput
            placeholder="Max Liter"
            placeholderTextColor="gray"
            value={filters.literMax}
            keyboardType="numeric"
            onChangeText={(text) => updateFilter("literMax", text)}
            className="flex-1 border border-gray-800 px-4 py-4 rounded-lg text-gray-800"
          />
        </View>

        {/* Total Range */}
        <View className="flex-row gap-3 mb-4">
          <TextInput
            placeholder="Min Total"
            placeholderTextColor="gray"
            value={filters.totalMin}
            keyboardType="numeric"
            onChangeText={(text) => updateFilter("totalMin", text)}
            className="flex-1 border border-gray-800 px-4 py-4 rounded-lg text-gray-800"
          />
          <TextInput
            placeholder="Max Total"
            placeholderTextColor="gray"
            value={filters.totalMax}
            keyboardType="numeric"
            onChangeText={(text) => updateFilter("totalMax", text)}
            className="flex-1 border border-gray-800 px-4 py-4 rounded-lg text-gray-800"
          />
        </View>

        {/* Paid Status */}
        <View style={{ zIndex: 1000, position: "relative" }} className="mb-6">
          <DropDownPicker
            open={paidOpen}
            value={filters.paidStatus}
            items={paidOptions}
            setOpen={setPaidOpen}
            setValue={(callback) =>
              updateFilter("paidStatus", callback(filters.paidStatus))
            }
            setItems={() => {}}
            placeholder="Select Paid Status"
            dropDownDirection="TOP"
            style={{ borderColor: "#1f2937" }}
            listMode="SCROLLVIEW"
            dropDownContainerStyle={{ borderColor: "#1f2937" }}
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

export default SalesFilterForm;
