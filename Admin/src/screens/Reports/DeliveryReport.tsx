// DeliveryReport.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import ReportHeader from "../../components/Report/Header/ReportHeader";
import Icon from "react-native-vector-icons/MaterialIcons";
import LinearGradient from "react-native-linear-gradient";
import ExportButton from "../../components/Report/ExportButton";
import * as XLSX from "xlsx";
import RNFS from "react-native-fs";
import Share from "react-native-share";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import DeliveryFilterForm from "../../components/Report/Delivery/DeliveryFilterForm";

const DeliveryReport = () => {
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [filterModal, setFilterModal] = useState(false);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const StatusColors: { [key: string]: string } = {
    Delivered: "#4caf50",
    Processed: "#2196f3",
    Pending: "#ff9800",
    Cancelled: "#f44336",
  };

  const data = [
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
      setDeliveries(data);
    } catch (err) {
      console.log("Error fetching delivery report:", err);
    } finally {
      setLoading(false);
    }
  };

  /** ------------------------------
   * Export Functions
   * ------------------------------ */
  const handleExportCSV = async () => {
    try {
      const exportData = filteredData.length > 0 ? filteredData : deliveries;
      if (exportData.length === 0) return Alert.alert("No data to export");

      const header = Object.keys(exportData[0]).join(",") + "\n";
      const rows = exportData.map((row) => Object.values(row).join(",")).join("\n");
      const csvString = header + rows;

      const path = `${RNFS.DocumentDirectoryPath}/delivery_report.csv`;
      await RNFS.writeFile(path, csvString, "utf8");
      await Share.open({ url: `file://${path}`, type: "text/csv" });
    } catch (err) {
      Alert.alert("Error", "Failed to export CSV");
      console.log(err);
    }
  };

  const handleExportExcel = async () => {
    try {
      const exportData = filteredData.length > 0 ? filteredData : deliveries;
      if (exportData.length === 0) return Alert.alert("No data to export");

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

      const excelData = XLSX.write(workbook, { type: "base64", bookType: "xlsx" });
      const path = `${RNFS.DocumentDirectoryPath}/delivery_report.xlsx`;
      await RNFS.writeFile(path, excelData, "base64");
      await Share.open({ url: `file://${path}`, type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    } catch (err) {
      Alert.alert("Error", "Failed to export Excel");
      console.log(err);
    }
  };

  const handleExportPDF = async () => {
    try {
      const exportData = filteredData.length > 0 ? filteredData : deliveries;
      if (exportData.length === 0) return Alert.alert("No data to export");

      const html = `
        <h1>Delivery Report</h1>
        <table border="1" cellspacing="0" cellpadding="5">
          <tr>
            <th>Route Group</th>
            <th>Vehicle Type</th>
            <th>Branch</th>
            <th>Order ID</th>
            <th>Status</th>
            <th>Total Amount</th>
          </tr>
          ${exportData
            .map(
              (d) => `
            <tr>
              <td>${d.routeGroup}</td>
              <td>${d.vehicleType}</td>
              <td>${d.branchName}</td>
              <td>${d.orderId}</td>
              <td>${d.orderStatus}</td>
              <td>₹${d.totalAmount}</td>
            </tr>
          `
            )
            .join("")}
        </table>
      `;

      const file = await RNHTMLtoPDF.convert({
        html,
        fileName: "delivery_report",
        base64: true,
      });

      await Share.open({ url: `file://${file.filePath}`, type: "application/pdf" });
    } catch (err) {
      Alert.alert("Error", "Failed to export PDF");
      console.log(err);
    }
  };

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with bg #3D8BFD */}
      <ReportHeader title="Delivery Report" onFilterPress={() => setFilterModal(true)} />

      {/* Delivery List */}
      <ScrollView className="p-4">
        {(filteredData.length > 0 ? filteredData : deliveries).map((d) => (
          <View
            key={d.id}
            className="bg-white rounded-3xl mb-6 shadow-lg border border-gray-300 overflow-hidden"
          >
            {/* Top banner */}
            <LinearGradient
              colors={["#3D8BFD", "#2563eb"]}
              className="px-4 py-3 flex-row justify-between items-center"
            >
              <Text className="text-white font-bold text-lg tracking-wide">
                {d.routeGroup}
              </Text>
              <View className="bg-white/90 px-3 py-1 rounded-full shadow-sm">
                <Text className="text-blue-700 text-xs font-semibold">
                  {d.vehicleType}
                </Text>
              </View>
            </LinearGradient>

            {/* Details */}
            <View className="p-5 space-y-5">
              {/* Location */}
              <View className="flex-row items-center">
                <View className="bg-blue-100 p-2 rounded-full shadow-sm">
                  <Icon name="location-on" size={20} color="#2563eb" />
                </View>
                <Text className="ml-3 text-gray-800 text-sm font-medium">
                  {d.location}
                </Text>
              </View>

              {/* Distance */}
              <View className="flex-row items-center">
                <View className="bg-gray-100 p-2 rounded-full shadow-sm">
                  <Icon name="map" size={20} color="#6b7280" />
                </View>
                <Text className="ml-3 text-gray-600 text-sm">
                  Distance:{" "}
                  <Text className="font-semibold text-gray-800">{d.distance}</Text>
                </Text>
              </View>

              {/* Branch */}
              <View className="flex-row items-center">
                <View className="bg-gray-100 p-2 rounded-full shadow-sm">
                  <Icon name="apartment" size={20} color="#374151" />
                </View>
                <Text className="ml-3 text-gray-700 text-sm">
                  Branch:{" "}
                  <Text className="font-semibold text-gray-900">{d.branchName}</Text>
                </Text>
              </View>

              {/* Divider */}
              <View className="h-[1px] bg-gray-200 my-2" />

              {/* Order & Amount */}
              <View className="flex-row justify-between items-center">
                {/* Order Info */}
                <View>
                  <View className="flex-row items-center mb-2">
                    <Icon name="receipt" size={18} color="#374151" />
                    <Text className="ml-2 text-gray-800 text-sm">
                      Order ID: <Text className="font-semibold">{d.orderId}</Text>
                    </Text>
                  </View>

                  {/* Amount Badge */}
                  <LinearGradient
                    colors={["#f0fdf4", "#dcfce7"]}
                    className="flex-row items-center px-3 py-1 rounded-lg shadow-sm"
                  >
                    <Icon name="currency-rupee" size={16} color="#15803d" />
                    <Text className="ml-1 text-green-800 text-sm font-bold">
                      ₹{d.totalAmount}
                    </Text>
                  </LinearGradient>
                </View>

                {/* Status Badge */}
                <View className="flex-row items-center px-4 py-1 rounded-full shadow-sm bg-gray-50">
                  <Icon
                    name={
                      d.orderStatus === "Delivered"
                        ? "check-circle"
                        : d.orderStatus === "Pending"
                        ? "pending-actions"
                        : d.orderStatus === "Processing"
                        ? "hourglass"
                        : d.orderStatus === "Cancelled"
                        ? "cancel"
                        : "error"
                    }
                    size={18}
                    color={StatusColors[d.orderStatus] || "#6b7280"}
                  />
                  <Text className="ml-2 text-xs font-bold text-gray-800">
                    {d.orderStatus}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Export Buttons */}
      <ExportButton
        data={filteredData.length > 0 ? filteredData : deliveries}
        onExportCSV={handleExportCSV}
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
      />

      {/* Filter Modal */}
      <Modal visible={filterModal} animationType="slide" transparent={true}>
        <View className="flex-1 bg-black/50 justify-end">
          <DeliveryFilterForm
            deliveries={deliveries}
            setFilteredData={setFilteredData}
            closeModal={() => setFilterModal(false)}
          />
        </View>
      </Modal>
    </View>
  );
}

export default DeliveryReport;