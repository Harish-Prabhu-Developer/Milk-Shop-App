// ProductReport.tsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Alert } from "react-native";
import ReportHeader from "../../components/Report/Header/ReportHeader";

export default function ProductReport() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
 const data=[
    {
      id: "1",
      name: "Fresh Milk",
      price: 45,
      unit: "1L",
      description: "Pure cow milk",
      nutrition: "Calcium, Protein",
      category: "milk",
      isActive: true,
      image: "https://via.placeholder.com/80",
    },
    {
      id: "2",
      name: "Paneer",
      price: 120,
      unit: "500g",
      description: "Fresh homemade paneer",
      nutrition: "Protein, Fat",
      category: "milk",
      isActive: true,
      image: "https://via.placeholder.com/80",
    },
  ];
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
    //   const res = await fetch("http://localhost:5000/api/products");
    //   const data = await res.json();
      setProducts(data);
    } catch (err) {
    //   Alert.alert("Error", "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <ReportHeader title="Product Report" onFilterPress={() => {}} />
    </View>
  );
}
