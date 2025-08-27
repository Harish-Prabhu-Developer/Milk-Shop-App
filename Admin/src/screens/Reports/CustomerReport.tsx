// CustomerReport.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import ReportHeader from "../../components/Report/Header/ReportHeader";
import ExportButton from "../../components/Report/ExportButton";
import  Icon  from "react-native-vector-icons/MaterialIcons";
import * as XLSX from "xlsx";
import RNFS from "react-native-fs";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import Share from "react-native-share";
import CustomerFilterForm from "../../components/Report/Customers/CustomerFilterForm";

export default function CustomerReport() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [filterModal, setFilterModal] = useState(false);

  // Demo data (replace with API later)
  const data = [
    {
      _id: "1",
      branchName: "Chennai Main Branch",
      email: "chennai@milk.com",
      phone: "9876543210",
      address: "No.12, Anna Nagar, Chennai",
      contactPerson: "Ramesh",
      location: "Chennai",
      registeredDate: "2025-01-15",
      role: "user",
      type: "NKC Local",
    },
    {
      _id: "2",
      branchName: "Coimbatore Branch",
      email: "coimbatore@milk.com",
      phone: "9123456780",
      address: "Race Course Road, Coimbatore",
      contactPerson: "Suresh",
      location: "Coimbatore",
      registeredDate: "2025-02-10",
      role: "user",
      type: "AKC OUT",
    },
  ];

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setCustomers(data);
      setFilteredData(data);
    } catch (err) {
      console.log("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  // 📌 Export functions
  const exportCSV = async (rows: any[]) => {
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customers");
    const wbout = XLSX.write(wb, { type: "base64", bookType: "csv" });
    const filePath = `${RNFS.DownloadDirectoryPath}/customers.csv`;
    await RNFS.writeFile(filePath, wbout, "base64");
    await Share.open({ url: `file://${filePath}` });
  };

  const exportExcel = async (rows: any[]) => {
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customers");
    const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
    const filePath = `${RNFS.DownloadDirectoryPath}/customers.xlsx`;
    await RNFS.writeFile(filePath, wbout, "base64");
    await Share.open({ url: `file://${filePath}` });
  };

  const exportPDF = async (rows: any[]) => {
    const html = `
      <h1>Customer Report</h1>
      <table border="1" style="width:100%;border-collapse:collapse;">
        <tr>
          <th>Branch</th><th>Email</th><th>Phone</th><th>Role</th>
        </tr>
        ${rows
          .map(
            (c) =>
              `<tr><td>${c.branchName}</td><td>${c.email}</td><td>${c.phone}</td><td>${c.role}</td></tr>`
          )
          .join("")}
      </table>`;
    const file = await RNHTMLtoPDF.convert({
      html,
      fileName: "customers",
      base64: true,
    });
    await Share.open({ url: `file://${file.filePath}` });
  };

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <ReportHeader title="Customer Report" onFilterPress={() => setFilterModal(true)} />

      {/* Customer List */}
      <ScrollView className="p-4">
      {filteredData.map((c) => (
  <View
    key={c._id}
    className="bg-white rounded-3xl shadow-lg p-5 mb-5 border border-gray-200"
  >
    {/* Branch Name + Type */}
    <View className="flex-row justify-between items-center mb-3">
      <Text className="text-xl font-semibold text-gray-900">
        {c.branchName}
      </Text>
      <View className="bg-blue-100 px-3 py-1 rounded-full">
        <Text className="text-blue-700 text-xs font-medium">{c.type}</Text>
      </View>
    </View>

    {/* Location */}
    <View className="flex-row items-center mb-2">
      <Icon name="location-on" size={18} color="#4b5563" style={{ marginRight: 6 }} />
      <Text className="text-gray-700 text-base">{c.location}</Text>
    </View>

    {/* Email */}
    <View className="flex-row items-center mb-2">
      <Icon name="email" size={18} color="#4b5563" style={{ marginRight: 6 }} />
      <Text className="text-gray-700 text-base">{c.email}</Text>
    </View>

    {/* Phone */}
    <View className="flex-row items-center mb-2">
      <Icon name="phone" size={18} color="#4b5563" style={{ marginRight: 6 }} />
      <Text className="text-gray-700 text-base">{c.phone}</Text>
    </View>

    {/* Contact Person */}
    <View className="flex-row items-center mb-1">
      <Icon name="person" size={18} color="#4b5563" style={{ marginRight: 6 }} />
      <Text className="text-gray-700 text-base">{c.contactPerson}</Text>
    </View>

    {/* Registered Date (extra detail) */}
    <View className="mt-3 border-t border-gray-100 pt-2">
      <Text className="text-gray-500 text-sm">
        Registered: {c.registeredDate}
      </Text>
    </View>
  </View>
))}


      </ScrollView>

      {/* Export Buttons */}
      <ExportButton
        data={filteredData}
        onExportCSV={exportCSV}
        onExportExcel={exportExcel}
        onExportPDF={exportPDF}
      />

      {/* Filter Modal */}
      <Modal visible={filterModal} animationType="slide" transparent={true}>
        <View className="flex-1 bg-black/50 justify-end">
          <CustomerFilterForm
            customers={customers}
            setFilteredData={setFilteredData}
            closeModal={() => setFilterModal(false)}
          />
        </View>
      </Modal>
    </View>
  );
}
