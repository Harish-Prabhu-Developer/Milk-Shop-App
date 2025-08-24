// SalesReport.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import * as XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { formatDate } from '../../utils/CustomFunctions/DateFunctions';
import SalesFilterForm from '../../components/Report/Sales/SalesFilterForm';

const SalesReport = () => {
  // Example Data
  const salesDataReport = [
    {
      Branch: {
        _id: '6899a717fbb5deded152c66b',
        branchName: 'KALLIKUPPAM NKC',
        phone: 9089438732,
        email: 'GwM4A@example.com',
        contactPerson: 'Muthu',
        location: 'Thiruvallur',
        routeName: 'KALLIKUPPAM NKC',
        type: 'NKC Local',
      },
      sales: [
        { date: '2025-08-20', price: 65, total: 1200, Paid: 'Yes', LITER: 20 },
        { date: '2025-08-21', price: 70, total: 1400, Paid: 'No', LITER: 25 },
      ],
    },
    {
      Branch: {
        _id: '6899a717fbb5deded152c66c',
        branchName: 'ANNA NAGAR',
        phone: 9876543210,
        email: 'annanagar@example.com',
        contactPerson: 'Ramesh',
        location: 'Chennai',
        routeName: 'ANNA NAGAR',
        type: 'City',
      },
      sales: [
        { date: '2025-08-20', price: 60, total: 1800, Paid: 'Yes', LITER: 30 },
        { date: '2025-08-21', price: 62, total: 1240, Paid: 'Yes', LITER: 20 },
      ],
    },
    {
      Branch: {
        _id: '6899a717fbb5deded152c66d',
        branchName: 'PORUR DEPOT',
        phone: 9123456789,
        email: 'porur@example.com',
        contactPerson: 'Suresh',
        location: 'Chennai',
        routeName: 'PORUR',
        type: 'City',
      },
      sales: [
        { date: '2025-08-20', price: 58, total: 870, Paid: 'No', LITER: 15 },
        { date: '2025-08-21', price: 59, total: 1180, Paid: 'Yes', LITER: 20 },
      ],
    },
  ];

  // State
  const [filteredData, setFilteredData] = useState(salesDataReport);
  const [filterModal, setFilterModal] = useState(false);

  // ✅ Unified filters object
  const [filters, setFilters] = useState({
    branchName: '',
    startDate: '',
    endDate: '',
    routeName: '',
    routeType: '',
    priceMin: '',
    priceMax: '',
    literMin: '',
    literMax: '',
    totalMin: '',
    totalMax: '',
    paidStatus: '',
  });

  const navigation = useNavigation<StackNavigationProp<any>>();

  // ✅ Generic updater
  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // ✅ Flatten sales data
  const flattenSalesData = (data: any[]) => {
    let rows: any[] = [];
    data.forEach(branchItem => {
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
    const header =
      'Branch,RouteType,Contact,Phone,Email,Location,RouteName,Date,Price,Total,Liter,Paid\n';
    const csv = rows
      .map(
        r =>
          `${r.branchName},${r.routeType},${r.contactPerson},${r.phone},${r.email},${r.location},${r.routeName},${r.date},${r.price},${r.total},${r.liter},${r.paid}`,
      )
      .join('\n');

    const path = `${RNFS.DownloadDirectoryPath}/SalesReport.csv`;
    await RNFS.writeFile(path, header + csv, 'utf8');
    await Share.open({ url: 'file://' + path, type: 'text/csv' });
  };

  // ✅ Export Excel
  const exportExcel = async (data: any[]) => {
    const rows = flattenSalesData(data);
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');
    const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

    const path = `${RNFS.DownloadDirectoryPath}/SalesReport.xlsx`;
    await RNFS.writeFile(path, wbout, 'base64');

    await Share.open({
      url: 'file://' + path,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
  };

  // ✅ Export PDF
  const exportPDF = async (data: any[]) => {
    const rows = flattenSalesData(data);
    const tableRows = rows
      .map(
        r => `
      <tr>
        <td>${r.branchName}</td>
        <td>${formatDate(r.date)}</td>
        <td>${r.price}</td>
        <td>${r.total}</td>
        <td>${r.liter}</td>
        <td>${r.paid}</td>
      </tr>
    `,
      )
      .join('');

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
      fileName: 'SalesReport',
      directory: 'Documents',
    });

    await Share.open({
      url: 'file://' + pdf.filePath,
      type: 'application/pdf',
    });
  };

  // ✅ Apply Filter
  const applyFilter = () => {
    let filtered = salesDataReport;

    filtered = filtered.map(branchItem => {
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
          filters.paidStatus !== 'All' &&
          sale.Paid.toLowerCase() !== filters.paidStatus.toLowerCase()
        )
          return false;

        return true;
      });

      return { ...branchItem, sales: filteredSales };
    });

    filtered = filtered.filter(branchItem => branchItem.sales.length > 0);

    setFilteredData(filtered);
    setFilterModal(false);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-primary pt-12 pb-8 px-5 shadow-md rounded-b-3xl">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="mr-3"
            >
              <MaterialIcons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
            <Text className="text-2xl text-white font-bold">Sales Report</Text>
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
            className="bg-white rounded-2xl shadow-lg p-5 mb-4 border border-gray-300"
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

      {/* Export Buttons */}
      <View className="flex-row justify-between px-4 py-5 bg-white border-t border-gray-200">
        <TouchableOpacity
          onPress={() => exportCSV(salesDataReport)}
          className="flex-1 flex-row items-center justify-center bg-blue-500 mx-1 py-3 rounded-xl shadow-md"
        >
          <MaterialIcons name="file-download" size={20} color="#fff" />
          <Text className="ml-2 text-white font-semibold">CSV</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => exportExcel(salesDataReport)}
          className="flex-1 flex-row items-center justify-center bg-green-500 mx-1 py-3 rounded-xl shadow-md"
        >
          <MaterialIcons name="table-chart" size={20} color="#fff" />
          <Text className="ml-2 text-white font-semibold">Excel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => exportPDF(salesDataReport)}
          className="flex-1 flex-row items-center justify-center bg-red-500 mx-1 py-3 rounded-xl shadow-md"
        >
          <MaterialIcons name="picture-as-pdf" size={20} color="#fff" />
          <Text className="ml-2 text-white font-semibold">PDF</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      {/* Filter Modal */}
      <Modal visible={filterModal} animationType="slide" transparent={true}>
        <View className="flex-1 bg-black/50 justify-end">
          <SalesFilterForm
            filters={filters}
            updateFilter={updateFilter}
            applyFilter={applyFilter}
            closeModal={() => setFilterModal(false)}
            routeNames={salesDataReport.map(branch => ({
              label: branch.Branch.routeName,
              value: branch.Branch.routeName,
            }))}
            routeTypes={salesDataReport.map(branch => ({
              label: branch.Branch.type,
              value: branch.Branch.type,
            }))}
            paidOptions={[
              { label: 'All', value: 'All' },
              { label: 'Yes', value: 'Yes' },
              { label: 'No', value: 'No' },
            ]}
            branches={salesDataReport.map(branch => ({
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
