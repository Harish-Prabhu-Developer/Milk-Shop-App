// CustomerReport.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import Share from "react-native-share";
import * as XLSX from "xlsx";
import RNFS from "react-native-fs";

export default function CustomerReport() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const data=[
    {
      id: "1",
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
      id: "2",
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
      // replace with your API endpoint
    //   const res = await fetch("http://localhost:5000/api/branches");
    //   const data = await res.json();
      setCustomers(data);
    } catch (err) {
    //   Alert.alert("Error", "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = async () => {
    const ws = XLSX.utils.json_to_sheet(customers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customers");
    const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
    const filePath = `${RNFS.DownloadDirectoryPath}/customers.xlsx`;
    await RNFS.writeFile(filePath, wbout, "base64");
    await Share.open({ url: `file://${filePath}` });
  };

  const exportToPDF = async () => {
    const html = `
      <h1>Customer Report</h1>
      <table border="1" style="width:100%;border-collapse:collapse;">
        <tr><th>Branch</th><th>Email</th><th>Phone</th><th>Role</th></tr>
        ${customers
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
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12 }}>
        Customer Report
      </Text>
      <ScrollView horizontal>
        <View>
          <View style={{ flexDirection: "row", backgroundColor: "#eee", padding: 8 }}>
            <Text style={{ width: 150, fontWeight: "bold" }}>Branch</Text>
            <Text style={{ width: 200, fontWeight: "bold" }}>Email</Text>
            <Text style={{ width: 150, fontWeight: "bold" }}>Phone</Text>
            <Text style={{ width: 100, fontWeight: "bold" }}>Role</Text>
          </View>
          {customers.map((c, i) => (
            <View key={i} style={{ flexDirection: "row", padding: 8, borderBottomWidth: 1 }}>
              <Text style={{ width: 150 }}>{c.branchName}</Text>
              <Text style={{ width: 200 }}>{c.email}</Text>
              <Text style={{ width: 150 }}>{c.phone}</Text>
              <Text style={{ width: 100 }}>{c.role}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
        <TouchableOpacity onPress={exportToExcel}>
          <Text style={{ padding: 10, backgroundColor: "green", color: "#fff", borderRadius: 8 }}>
            Export Excel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={exportToPDF}>
          <Text style={{ padding: 10, backgroundColor: "red", color: "#fff", borderRadius: 8 }}>
            Export PDF
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
