// DeliveryReport.tsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Alert } from "react-native";
import ReportHeader from "../../components/Report/Header/ReportHeader";

export default function DeliveryReport() {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
 const data=[
    {
      id: "1",
      routeGroup: "ROUTE 1",
      vehicleType: "COMPANY VEHICLE",
      location: "Anna Nagar, Chennai",
      distance: "12km",
      branchName: "Chennai Main Branch",
      orderId: "ORD1001",
      orderStatus: "Delivered",
      totalAmount: 450,
    },
    {
      id: "2",
      routeGroup: "ROUTE 2",
      vehicleType: "CUSTOMER VEHICLE",
      location: "Coimbatore",
      distance: "25km",
      branchName: "Coimbatore Branch",
      orderId: "ORD1002",
      orderStatus: "Pending",
      totalAmount: 800,
    },
  ];
  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
    //   const res = await fetch("http://localhost:5000/api/delivery-report");
    //   const data = await res.json();
      setDeliveries(data);
    } catch (err) {
    //   Alert.alert("Error", "Failed to fetch delivery report");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <ReportHeader title="Delivery Report" onFilterPress={() => {}} />
    </View>
  );
}
