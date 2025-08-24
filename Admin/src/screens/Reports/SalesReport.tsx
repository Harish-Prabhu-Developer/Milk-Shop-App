// SalesReport.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import * as XLSX from "xlsx";
import RNFS from "react-native-fs";
import Share from "react-native-share";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { formatDate } from "../../utils/CustomFunctions/DateFunctions";

const SalesReport = () => {
  // Example Data
// Example Data
const salesDataReport = [
  {
    Branch: {
      _id: "6899a717fbb5deded152c66b",
      branchName: "KALLIKUPPAM NKC",
      phone: 9089438732,
      email: "GwM4A@example.com",
      contactPerson: "Muthu",
      location: "Thiruvallur",
      routeName: "KALLIKUPPAM NKC",
      type: "NKC Local",
    },
    sales: [
      { date: "2025-08-20", price: 65, total: 1200, Paid: "Yes", LITER: 20 },
      { date: "2025-08-21", price: 70, total: 1400, Paid: "No", LITER: 25 },
    ],
  },
  {
    Branch: {
      _id: "6899a717fbb5deded152c66c",
      branchName: "ANNA NAGAR",
      phone: 9876543210,
      email: "annanagar@example.com",
      contactPerson: "Ramesh",
      location: "Chennai",
      routeName: "ANNA NAGAR",
      type: "City",
    },
    sales: [
      { date: "2025-08-20", price: 60, total: 1800, Paid: "Yes", LITER: 30 },
      { date: "2025-08-21", price: 62, total: 1240, Paid: "Yes", LITER: 20 },
    ],
  },
  {
    Branch: {
      _id: "6899a717fbb5deded152c66d",
      branchName: "PORUR DEPOT",
      phone: 9123456789,
      email: "porur@example.com",
      contactPerson: "Suresh",
      location: "Chennai",
      routeName: "PORUR",
      type: "City",
    },
    sales: [
      { date: "2025-08-20", price: 58, total: 870, Paid: "No", LITER: 15 },
      { date: "2025-08-21", price: 59, total: 1180, Paid: "Yes", LITER: 20 },
    ],
  },
  {
    Branch: {
      _id: "6899a717fbb5deded152c66e",
      branchName: "TAMBARAM SOUTH",
      phone: 9988776655,
      email: "tambaram@example.com",
      contactPerson: "Anitha",
      location: "Chennai",
      routeName: "TAMBARAM",
      type: "Suburban",
    },
    sales: [
      { date: "2025-08-20", price: 64, total: 1920, Paid: "Yes", LITER: 30 },
      { date: "2025-08-21", price: 65, total: 975, Paid: "No", LITER: 15 },
    ],
  },
  {
    Branch: {
      _id: "6899a717fbb5deded152c66f",
      branchName: "AVADI MAIN",
      phone: 9012345678,
      email: "avadi@example.com",
      contactPerson: "Karthik",
      location: "Avadi",
      routeName: "AVADI",
      type: "Suburban",
    },
    sales: [
      { date: "2025-08-20", price: 63, total: 1260, Paid: "Yes", LITER: 20 },
      { date: "2025-08-21", price: 64, total: 1920, Paid: "Yes", LITER: 30 },
    ],
  },
  {
    Branch: {
      _id: "6899a717fbb5deded152c670",
      branchName: "KOYAMBEDU CENTRAL",
      phone: 9345678901,
      email: "koyambedu@example.com",
      contactPerson: "Deepak",
      location: "Chennai",
      routeName: "KOYAMBEDU",
      type: "Wholesale",
    },
    sales: [
      { date: "2025-08-20", price: 55, total: 5500, Paid: "Yes", LITER: 100 },
      { date: "2025-08-21", price: 56, total: 2800, Paid: "No", LITER: 50 },
    ],
  },
  {
    Branch: {
      _id: "6899a717fbb5deded152c671",
      branchName: "PATTABIRAM EAST",
      phone: 9456123780,
      email: "pattabiram@example.com",
      contactPerson: "Meena",
      location: "Chennai",
      routeName: "PATTABIRAM",
      type: "Local",
    },
    sales: [
      { date: "2025-08-20", price: 68, total: 1360, Paid: "Yes", LITER: 20 },
      { date: "2025-08-21", price: 69, total: 1380, Paid: "Yes", LITER: 20 },
    ],
  },
];

  // State
  const [filteredData, setFilteredData] = useState(salesDataReport);
  const [filterModal, setFilterModal] = useState(false);
  const [searchBranch, setSearchBranch] = useState("");

  const navigation = useNavigation<StackNavigationProp<any>>();

  // Apply filter by branch name
  const applyFilter = () => {
    if (!searchBranch.trim()) {
      setFilteredData(salesDataReport);
    } else {
      const filtered = salesDataReport.filter((branchItem) =>
        branchItem.Branch.branchName
          .toLowerCase()
          .includes(searchBranch.toLowerCase())
      );
      setFilteredData(filtered);
    }
    setFilterModal(false);
  };
const flattenSalesData = (data: any[]) => {
  let rows: any[] = [];
  data.forEach((branchItem) => {
    branchItem.sales.forEach((sale: any) => {
      rows.push({
        branchName: branchItem.Branch.branchName,
        routeType: branchItem.Branch.type,
        contactPerson: branchItem.Branch.contactPerson,
        phone: branchItem.Branch.phone,
        email: branchItem.Branch.email,
        location: branchItem.Branch.location,
        routeName: branchItem.Branch.routeName,
        date: sale.date,
        price: sale.price,
        total: sale.total,
        liter: sale.LITER,
        paid: sale.Paid,
      });
    });
  });
  return rows;
};

// ✅ Export CSV
const exportCSV = async (data: any[]) => {
  const rows = flattenSalesData(data);
  const header = "Branch,RouteType,Contact,Phone,Email,Location,RouteName,Date,Price,Total,Liter,Paid\n";
  const csv = rows.map(r => 
    `${r.branchName},${r.routeType},${r.contactPerson},${r.phone},${r.email},${r.location},${r.routeName},${r.date},${r.price},${r.total},${r.liter},${r.paid}`
  ).join("\n");

  const path = `${RNFS.DownloadDirectoryPath}/SalesReport.csv`;
  await RNFS.writeFile(path, header + csv, "utf8");

  await Share.open({ url: "file://" + path, type: "text/csv" });
};

// ✅ Export Excel
const exportExcel = async (data: any[]) => {
  const rows = flattenSalesData(data);
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sales Report");

  // Write workbook as base64
  const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

  const path = `${RNFS.DownloadDirectoryPath}/SalesReport.xlsx`;
  await RNFS.writeFile(path, wbout, "base64"); // ✅ RNFS expects string here

  await Share.open({
    url: "file://" + path,
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
};


// ✅ Export PDF
const exportPDF = async (data: any[]) => {
  const rows = flattenSalesData(data);
  const tableRows = rows.map(r => `
    <tr>
      <td>${r.branchName}</td>
      <td>${formatDate(r.date)}</td>
      <td>${r.price}</td>
      <td>${r.total}</td>
      <td>${r.liter}</td>
      <td>${r.paid}</td>
    </tr>
  `).join("");

  const html = `
    <h1 style="text-align:center;">Sales Report</h1>
    <table border="1" style="width:100%;border-collapse:collapse;">
      <tr>
        <th>Branch</th>
        <th>Date</th>
        <th>Price</th>
        <th>Total</th>
        <th>Liter</th>
        <th>Paid</th>
      </tr>
      ${tableRows}
    </table>
  `;

  const pdf = await RNHTMLtoPDF.convert({
    html,
    fileName: "SalesReport",
    directory: "Documents",
  });

  await Share.open({ url: "file://" + pdf.filePath, type: "application/pdf" });
};
  return (
    <View className="flex-1 bg-gray-50">
      Header
      <View className="bg-primary pt-12 pb-8 px-5 shadow-md rounded-b-3xl">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="mr-3"
            >
              <MaterialIcons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
            <Text className="text-2xl text-white font-bold">
              Sales Report
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setFilterModal(true)}
            className="bg-white/20 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-semibold">Filter</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Report List */}
      <ScrollView className="p-4">
        {filteredData.map((branchItem, index) => (
          <View
            key={index}
            className="bg-white rounded-2xl shadow-lg p-5 mb-4 border border-gray-100"
          >
            <Text className="text-xl font-semibold text-gray-900 mb-3">
              {branchItem.Branch.branchName}
            </Text>
            {branchItem.sales.map((sale, idx) => (
              <View
                key={idx}
                className="flex-row justify-between bg-gray-50 rounded-xl px-4 py-3 mb-2"
              >
                <Text className="text-sm text-gray-700">{formatDate(sale.date)}</Text>
                <Text className="text-sm font-semibold text-primary">
                  ₹{sale.total}
                </Text>
                <Text className="text-sm text-gray-600">
                  {sale.LITER} L ({sale.Paid})
                </Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Export Buttons */}
      <View className="flex-row justify-between px-4 py-5 bg-white border-t border-gray-200">
        <TouchableOpacity
          onPress={()=>exportCSV(salesDataReport)}
          className="flex-1 flex-row items-center justify-center bg-blue-500 mx-1 py-3 rounded-xl shadow-md"
        >
          <MaterialIcons name="file-download" size={20} color="#fff" />
          <Text className="ml-2 text-white font-semibold">CSV</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={()=>exportExcel(salesDataReport)}
          className="flex-1 flex-row items-center justify-center bg-green-500 mx-1 py-3 rounded-xl shadow-md"
        >
          <MaterialIcons name="table-chart" size={20} color="#fff" />
          <Text className="ml-2 text-white font-semibold">Excel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={()=>exportPDF(salesDataReport)}
          className="flex-1 flex-row items-center justify-center bg-red-500 mx-1 py-3 rounded-xl shadow-md"
        >
          <MaterialIcons name="picture-as-pdf" size={20} color="#fff" />
          <Text className="ml-2 text-white font-semibold">PDF</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal visible={filterModal} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/40">
          <View className="bg-white w-80 p-6 rounded-2xl shadow-2xl">
            <Text className="text-xl font-bold mb-4 text-gray-900">
              🔍 Filter Report
            </Text>
            <TextInput
              placeholder="Enter branch name"
              value={searchBranch}
              onChangeText={setSearchBranch}
              className="border border-gray-300 rounded-xl px-4 py-3 mb-5 text-gray-800"
              placeholderTextColor="#9ca3af"
            />

            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setFilterModal(false)}
                className="flex-1 bg-gray-200 rounded-xl py-3 mx-1"
              >
                <Text className="text-center font-semibold text-gray-700">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={applyFilter}
                className="flex-1 bg-primary rounded-xl py-3 mx-1"
              >
                <Text className="text-center font-semibold text-white">
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SalesReport;
