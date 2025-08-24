// DeliveryReport.tsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Alert } from "react-native";

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
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12 }}>
        Delivery Report
      </Text>
      <ScrollView horizontal>
        <View>
          <View style={{ flexDirection: "row", backgroundColor: "#eee", padding: 8 }}>
            <Text style={{ width: 150, fontWeight: "bold" }}>Route Group</Text>
            <Text style={{ width: 150, fontWeight: "bold" }}>Location</Text>
            <Text style={{ width: 120, fontWeight: "bold" }}>Distance</Text>
            <Text style={{ width: 180, fontWeight: "bold" }}>Order Status</Text>
            <Text style={{ width: 150, fontWeight: "bold" }}>Total Amount</Text>
          </View>
          {deliveries.map((d, i) => (
            <View key={i} style={{ flexDirection: "row", padding: 8, borderBottomWidth: 1 }}>
              <Text style={{ width: 150 }}>{d.RouteGroup}</Text>
              <Text style={{ width: 150 }}>{d.location}</Text>
              <Text style={{ width: 120 }}>{d.distance}</Text>
              <Text style={{ width: 180 }}>{d.OrderStatus}</Text>
              <Text style={{ width: 150 }}>{d.TotalAmount}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
