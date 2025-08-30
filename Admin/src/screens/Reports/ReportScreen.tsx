// ReportScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Card } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { LineChart, PieChart } from "react-native-chart-kit";
import Header from "../../components/Header";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import axios from "axios";
import { API_URL } from "@env";
import ServerDownScreen from "../ServerDownScreen";
import { StackNavigationProp } from "@react-navigation/stack";

const screenWidth = Dimensions.get("window").width;

const ReportScreen = () => {
  const [loading, setLoading] = useState(true);       // for first load
  const [refreshing, setRefreshing] = useState(false); // for pull-to-refresh
  const [stats, setStats] = useState<any>(null);

  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const stackNav = useNavigation<StackNavigationProp<any>>();
  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await axios.get(`${API_URL}/milkapp/reports/report`);
      setStats(response.data);
    } catch (error:any) {
            if (!error.response) {
                console.log('Network Error: Server unreachable.');
                stackNav.navigate('ServerDownScreen');
            } else {
                console.error("Error fetching report:", error);
            }
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Full-screen loader only on first load */}
      {loading && !refreshing && (
        <View className="absolute top-0 left-0 right-0 bottom-0 flex-row gap-4 items-center justify-center bg-black/40 z-50">
          <ActivityIndicator size="large" color="#3D8BFD" />
          <Text className="text-white text-lg font-bold mt-2">Loading...</Text>
        </View>
      )}

      <Header title={"Reports"} />

      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchReport(true)} />
        }
      >
        {stats && (
          <>
            {/* Date Range Filter */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-semibold">Overview</Text>
            </View>

            {/* Quick Stats */}
            <View className="flex-row flex-wrap gap-3 mb-4">
              <Card style={{ flex: 1, padding: 12 }}>
                <Text className="text-gray-500">Total Sales</Text>
                <Text className="text-xl font-bold">₹ {stats.totalSales}</Text>
              </Card>
              <Card style={{ flex: 1, padding: 12 }}>
                <Text className="text-gray-500">Orders</Text>
                <Text className="text-xl font-bold">{stats.orders}</Text>
              </Card>
            </View>

            <View className="flex-row flex-wrap gap-3 mb-6">
              <Card style={{ flex: 1, padding: 12 }}>
                <Text className="text-gray-500">Branches</Text>
                <Text className="text-xl font-bold">{stats.Branch}</Text>
              </Card>
              <Card style={{ flex: 1, padding: 12 }}>
                <Text className="text-gray-500">Pending Payments</Text>
                <Text className="text-xl font-bold">₹ {stats.pending}</Text>
              </Card>
            </View>

            {/* Sales Trend Chart */}
            {stats.salesTrend && (
              <>
                <Text className="text-xl font-semibold mb-2">Sales Trend</Text>
                <LineChart
                  data={stats.salesTrend}
                  width={screenWidth - 32}
                  height={220}
                  chartConfig={{
                    backgroundGradientFrom: "#ffffff",
                    backgroundGradientTo: "#ffffff",
                    color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
                  }}
                  bezier
                  style={{ borderRadius: 8, marginBottom: 24 }}
                />
              </>
            )}

            {/* Product Distribution Pie Chart */}
            {stats.productData && stats.productData.length > 0 && (
              <>
                <Text className="text-xl font-semibold mb-2">
                  Product Sales Distribution
                </Text>
                <PieChart
                  data={stats.productData}
                  width={screenWidth - 32}
                  height={220}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  chartConfig={{
                    color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
                  }}
                  absolute
                />
              </>
            )}

            {/* Report Categories */}
            <Text className="text-xl font-semibold mt-6 mb-3">
              Report Categories
            </Text>
            <View className="gap-3 mb-16">
              {[
                { label: "Sales Report", icon: "bar-chart", route: "SalesReport" },
                { label: "Customer Report", icon: "people", route: "CustomerReport" },
                { label: "Delivery Report", icon: "local-shipping", route: "DeliveryReport" },
                { label: "Product Report", icon: "inventory", route: "ProductReport" },
              ].map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className="flex-row items-center bg-gray-100 p-3 rounded-xl"
                  onPress={() => navigation.navigate(item.route)}
                >
                  <Icon name={item.icon} size={22} color="#333" />
                  <Text className="ml-3 text-gray-800">{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default ReportScreen;
