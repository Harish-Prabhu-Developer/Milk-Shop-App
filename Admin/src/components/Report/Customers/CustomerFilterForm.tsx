// CustomerFilterForm.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import DropDownPicker from "react-native-dropdown-picker";

interface CustomerFilterFormProps {
  customers: any[];
  setFilteredData: (data: any[]) => void;
  closeModal: () => void;
}

const CustomerFilterForm: React.FC<CustomerFilterFormProps> = ({
  customers,
  setFilteredData,
  closeModal,
}) => {
  // filters
  const [filters, setFilters] = useState({
    branchName: null,
    phone: null,
    email: null,
    type: null,
  });

  // dropdown states
  const [branchOpen, setBranchOpen] = useState(false);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);

  // unique dropdown items from customers
  const branches = [
    ...new Map(customers.map((c) => [c.branchName, { label: c.branchName, value: c.branchName }])).values(),
  ];
  const phones = [
    ...new Map(customers.map((c) => [c.phone, { label: c.phone, value: c.phone }])).values(),
  ];
  const emails = [
    ...new Map(customers.map((c) => [c.email, { label: c.email, value: c.email }])).values(),
  ];
  const types = [
    ...new Map(customers.map((c) => [c.type, { label: c.type, value: c.type }])).values(),
  ];

  // update helper
  const updateFilter = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // clear filter
  const handleClear = () => {
    setFilters({
      branchName: null,
      phone: null,
      email: null,
      type: null,
    });
    setFilteredData(customers);
    closeModal();
  };

  // apply filter
  const applyFilter = () => {
    let filtered = [...customers];

    if (filters.branchName) {
      filtered = filtered.filter((c) => c.branchName === filters.branchName);
    }
    if (filters.phone) {
      filtered = filtered.filter((c) => c.phone === filters.phone);
    }
    if (filters.email) {
      filtered = filtered.filter((c) => c.email === filters.email);
    }
    if (filters.type) {
      filtered = filtered.filter((c) => c.type === filters.type);
    }

    setFilteredData(filtered);
    closeModal();
  };

  return (
    <View className="bg-white rounded-t-3xl p-5 max-h-[80%]">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-xl font-bold text-gray-800">Filter Customers</Text>
        <TouchableOpacity onPress={closeModal}>
          <Ionicons name="close-circle" size={28} color="#dc2626" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Branch Name */}
        <View style={{ zIndex: 4000 }} className="mb-4">
          <DropDownPicker
            listMode="SCROLLVIEW"
            open={branchOpen}
            value={filters.branchName}
            items={branches}
            setOpen={setBranchOpen}
            setValue={(cb) => updateFilter("branchName", cb(filters.branchName))}
            setItems={() => {}}
            placeholder="Select Branch"
            style={{ borderColor: "#1f2937" }}
            dropDownContainerStyle={{ borderColor: "#1f2937" }}
          />
        </View>

        {/* Phone */}
        <View style={{ zIndex: 3000 }} className="mb-4">
          <DropDownPicker
            listMode="SCROLLVIEW"
            open={phoneOpen}
            value={filters.phone}
            items={phones}
            setOpen={setPhoneOpen}
            setValue={(cb) => updateFilter("phone", cb(filters.phone))}
            setItems={() => {}}
            placeholder="Select Phone"
            style={{ borderColor: "#1f2937" }}
            dropDownContainerStyle={{ borderColor: "#1f2937" }}
          />
        </View>

        {/* Email */}
        <View style={{ zIndex: 2000 }} className="mb-4">
          <DropDownPicker
            listMode="SCROLLVIEW"
            open={emailOpen}
            value={filters.email}
            items={emails}
            setOpen={setEmailOpen}
            setValue={(cb) => updateFilter("email", cb(filters.email))}
            setItems={() => {}}
            placeholder="Select Email"
            style={{ borderColor: "#1f2937" }}
            dropDownContainerStyle={{ borderColor: "#1f2937" }}
          />
        </View>

        {/* Type */}
        <View style={{ zIndex: 1000 }} className="mb-6">
          <DropDownPicker
            listMode="SCROLLVIEW"
            open={typeOpen}
            value={filters.type}
            items={types}
            setOpen={setTypeOpen}
            setValue={(cb) => updateFilter("type", cb(filters.type))}
            setItems={() => {}}
            placeholder="Select Type"
            style={{ borderColor: "#1f2937" }}
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

export default CustomerFilterForm;
