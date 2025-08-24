// ProductReport.tsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Alert } from "react-native";

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
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12 }}>
        Product Report
      </Text>
      <ScrollView horizontal>
        <View>
          <View style={{ flexDirection: "row", backgroundColor: "#eee", padding: 8 }}>
            <Text style={{ width: 150, fontWeight: "bold" }}>Name</Text>
            <Text style={{ width: 100, fontWeight: "bold" }}>Price</Text>
            <Text style={{ width: 80, fontWeight: "bold" }}>Unit</Text>
            <Text style={{ width: 200, fontWeight: "bold" }}>Description</Text>
            <Text style={{ width: 150, fontWeight: "bold" }}>Category</Text>
            <Text style={{ width: 100, fontWeight: "bold" }}>Active</Text>
          </View>
          {products.map((p, i) => (
            <View key={i} style={{ flexDirection: "row", padding: 8, borderBottomWidth: 1 }}>
              <Text style={{ width: 150 }}>{p.name}</Text>
              <Text style={{ width: 100 }}>{p.price}</Text>
              <Text style={{ width: 80 }}>{p.unit}</Text>
              <Text style={{ width: 200 }}>{p.description}</Text>
              <Text style={{ width: 150 }}>{p.category}</Text>
              <Text style={{ width: 100 }}>{p.isActive ? "Yes" : "No"}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
