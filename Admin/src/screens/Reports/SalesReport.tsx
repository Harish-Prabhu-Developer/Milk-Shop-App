// SalesReport.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import * as XLSX from "xlsx";
import RNFS from "react-native-fs";
import Share from "react-native-share";
import RNHTMLtoPDF from "react-native-html-to-pdf";

import { formatDate } from "../../utils/CustomFunctions/DateFunctions";
import SalesFilterForm from "../../components/Report/Sales/SalesFilterForm";
import ReportHeader from "../../components/Report/Header/ReportHeader";
import ExportButton from "../../components/Report/ExportButton";
import { API_URL } from "@env";
import axios from "axios";
import { SalesPDFTemplate } from "../../components/Report/PDF Templates/SalesReportPDF";

const SalesReport = () => {
  // ✅ States
  const [salesData, setSalesData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [filterModal, setFilterModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Filters
  const [filters, setFilters] = useState({
    branchName: "",
    startDate: "",
    endDate: "",
    routeName: "",
    routeType: "",
    priceMin: "",
    priceMax: "",
    literMin: "",
    literMax: "",
    totalMin: "",
    totalMax: "",
    paidStatus: "All",
  });

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // ✅ Fetch Data
  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/milkapp/reports/sales`);
      setSalesData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error fetching sales data:", error);
      setSalesData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Flatten sales data
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

  // ✅ Export Functions (CSV, Excel, PDF) — unchanged
  const exportCSV = async (data: any[]) => {
    try {
      const rows = flattenSalesData(data);
      const cleanRows = rows.map((r) => ({
        ...r,
        price: r.price.toFixed(2),
        total: r.total.toFixed(2),
        liter: r.liter.toFixed(2),
      }));
      const ws = XLSX.utils.json_to_sheet(cleanRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sales");
      const wbout = XLSX.write(wb, { type: "base64", bookType: "csv" });

      const path = `${RNFS.DownloadDirectoryPath}/sales-${formatDate(
        new Date().toISOString()
      )}.csv`;

      await RNFS.writeFile(path, wbout, "base64");

      await Share.open({
        url: `file://${path}`,
        type: "text/csv",
      });
    } catch (err) {
      console.error("CSV Export error:", err);
    }
  };

  const exportExcel = async (data: any[]) => {
    try {
      const rows = flattenSalesData(data);
      const cleanRows = rows.map((r) => ({
        ...r,
        price: r.price.toFixed(2),
        total: r.total.toFixed(2),
        liter: r.liter.toFixed(2),
      }));
      const ws = XLSX.utils.json_to_sheet(cleanRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sales");
      const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
      const filePath = `${RNFS.DownloadDirectoryPath}/sales-${formatDate(
        new Date().toISOString()
      )}.xlsx`;
      await RNFS.writeFile(filePath, wbout, "base64");
      await Share.open({ url: `file://${filePath}` });
    } catch (err) {
      console.error("Excel Export error:", err);
    }
  };

  const exportPDF = async (data: any[]) => {
    const file = await RNHTMLtoPDF.convert({
      html: SalesPDFTemplate(flattenSalesData(data)),
      fileName: `Sales_Report-${formatDate(new Date().toISOString())}`,
      base64: true,
    });

    await Share.open({ url: `file://${file.filePath}` });
  };

  // ✅ Apply Filter
  const applyFilter = () => {
    let filtered = salesData; // use API data, not mock

    filtered = filtered.map((branchItem) => {
      const filteredSales = branchItem.sales.filter((sale: any) => {
        const saleDate = new Date(sale.date);

        if (
          filters.branchName &&
          !branchItem.Branch.branchName
            .toLowerCase()
            .includes(filters.branchName.toLowerCase())
        )
          return false;

        if (filters.startDate && saleDate < new Date(filters.startDate))
          return false;
        if (filters.endDate && saleDate > new Date(filters.endDate))
          return false;

        if (
          filters.routeName &&
          !branchItem.Branch.routeName
            .toLowerCase()
            .includes(filters.routeName.toLowerCase())
        )
          return false;

        if (
          filters.routeType &&
          branchItem.Branch.type.toLowerCase() !==
            filters.routeType.toLowerCase()
        )
          return false;

        if (filters.priceMin && sale.price < Number(filters.priceMin))
          return false;
        if (filters.priceMax && sale.price > Number(filters.priceMax))
          return false;

        if (filters.literMin && sale.LITER < Number(filters.literMin))
          return false;
        if (filters.literMax && sale.LITER > Number(filters.literMax))
          return false;

        if (filters.totalMin && sale.total < Number(filters.totalMin))
          return false;
        if (filters.totalMax && sale.total > Number(filters.totalMax))
          return false;

        if (
          filters.paidStatus &&
          filters.paidStatus !== "All" &&
          sale.Paid.toLowerCase() !== filters.paidStatus.toLowerCase()
        )
          return false;

        return true;
      });

      return { ...branchItem, sales: filteredSales };
    });

    filtered = filtered.filter((branchItem) => branchItem.sales.length > 0);

    setFilteredData(filtered);
    setFilterModal(false);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <ReportHeader
        title="Sales Report"
        onFilterPress={() => setFilterModal(true)}
      />

      {/* Loader */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="mt-3 text-gray-600 font-semibold">
            Fetching Sales Data...
          </Text>
        </View>
      ) : filteredData.length === 0 ? (
        // ✅ Empty State
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500 text-lg">No Sales Reports Found</Text>
        </View>
      ) : (
        // ✅ Report List
        <ScrollView className="p-4">
          {filteredData.map((branchItem, index) => (
            <View
              key={index}
              className="bg-white rounded-2xl shadow-lg p-5 mb-4 border border-gray-200"
            >
              <Text className="text-xl font-semibold text-gray-900">
                {branchItem.Branch.branchName}
              </Text>
              {branchItem.sales.map((sale: any, idx: number) => (
                <View
                  key={idx}
                  className="flex-row justify-between bg-gray-50 rounded-xl px-4 py-3 mb-2"
                >
                  <Text className="text-sm text-gray-700">
                    {formatDate(sale.date)}
                  </Text>
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
      )}

      {/* Export Buttons */}
      {!loading && filteredData.length > 0 && (
        <ExportButton
          data={filteredData}
          onExportCSV={exportCSV}
          onExportExcel={exportExcel}
          onExportPDF={exportPDF}
        />
      )}

      {/* Filter Modal */}
      <Modal visible={filterModal} animationType="slide" transparent={true}>
        <View className="flex-1 bg-black/50 justify-end">
          <SalesFilterForm
            filters={filters}
            updateFilter={updateFilter}
            applyFilter={applyFilter}
            closeModal={() => setFilterModal(false)}
            routeNames={salesData.map((branch) => ({
              label: branch.Branch.routeName,
              value: branch.Branch.routeName,
            }))}
            routeTypes={salesData.map((branch) => ({
              label: branch.Branch.type,
              value: branch.Branch.type,
            }))}
            paidOptions={[
              { label: "All", value: "All" },
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" },
            ]}
            branches={salesData.map((branch) => ({
              label: branch.Branch.branchName,
              value: branch.Branch.branchName,
            }))}
          />
        </View>
      </Modal>
    </View>
  );
};

export default SalesReport;
