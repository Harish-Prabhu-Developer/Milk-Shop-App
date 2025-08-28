// CustomerReport.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Modal } from 'react-native';
import ReportHeader from '../../components/Report/Header/ReportHeader';
import ExportButton from '../../components/Report/ExportButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import CustomerFilterForm from '../../components/Report/Customers/CustomerFilterForm';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchBranch } from '../../redux/slices/userSlice';
import { formatDate } from '../../utils/CustomFunctions/DateFunctions';
import { Branch } from '../../@types/User';
import { CustomerPDFTemplate } from '../../components/Report/PDF Templates/CustomerReportPDF';

export default function CustomerReport() {
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<Branch[]>([]);
  const [filterModal, setFilterModal] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const branches = useSelector((state: RootState) => state.user.users);

  // 🔹 Fetch customers once
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchBranch());
      } catch (err) {
        console.log('Error fetching customers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  // 🔹 Sync Redux data -> filteredData
  useEffect(() => {
    if (branches.length) {
      setFilteredData(branches);
    }
  }, [branches]);

  // 📌 Export functions
const exportCSV = async (rows: any[]) => {
  // Remove unwanted fields
  // Remove unwanted fields & rename headers
    const cleanRows = rows.map(({ branchName, email, phone, contactPerson,registeredDate }) => ({
    "Branch Name": branchName,
    Email: email,
    "Contact Number": phone,
    "Contact Person": contactPerson,
    "Registered Date": formatDate(registeredDate),
  }));
  const ws = XLSX.utils.json_to_sheet(cleanRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Customers");

  const wbout = XLSX.write(wb, { type: "base64", bookType: "csv" });
  const filePath = `${RNFS.DownloadDirectoryPath}/customers-${formatDate(new Date().toISOString())}.csv`;

  await RNFS.writeFile(filePath, wbout, "base64");
  await Share.open({ url: `file://${filePath}` });
};


  const exportExcel = async (rows: any[]) => {
      // Remove unwanted fields
    const cleanRows = rows.map(({ branchName, email, phone, contactPerson,registeredDate }) => ({
    "Branch Name": branchName,
    Email: email,
    "Contact Number": phone,
    "Contact Person": contactPerson,
    "Registered Date": formatDate(registeredDate),
  }));
    const ws = XLSX.utils.json_to_sheet(cleanRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Customers');
    const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
    const filePath = `${RNFS.DownloadDirectoryPath}/customers-${formatDate(new Date().toISOString())}.xlsx`;
    await RNFS.writeFile(filePath, wbout, 'base64');
    await Share.open({ url: `file://${filePath}` });
  };

const exportPDF = async (rows: Branch[]) => {
  

  const file = await RNHTMLtoPDF.convert({
    html: CustomerPDFTemplate(rows),
    fileName: `Customers_Report-${formatDate(new Date().toISOString())}`,
    base64: true,
  });

  await Share.open({ url: `file://${file.filePath}` });
};


  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text className="mt-2 text-gray-600">Loading Customers...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <ReportHeader
        title="Customer Report"
        onFilterPress={() => setFilterModal(true)}
      />

      {/* Customer List */}
      <ScrollView className="p-4">
        {filteredData.map((c: Branch) => (
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
                <Text className="text-blue-700 text-xs font-medium">
                  {c.type}
                </Text>
              </View>
            </View>

            {/* Location */}
            {c.location && (
              <View className="flex-row items-center mb-2">
                <Icon name="location-on" size={18} color="#4b5563" style={{ marginRight: 6 }} />
                <Text className="text-gray-700 text-base">{c.location}</Text>
              </View>
            )}

            {/* Email */}
            {c.email && (
              <View className="flex-row items-center mb-2">
                <Icon name="email" size={18} color="#4b5563" style={{ marginRight: 6 }} />
                <Text className="text-gray-700 text-base">{c.email}</Text>
              </View>
            )}

            {/* Phone */}
            {c.phone && (
              <View className="flex-row items-center mb-2">
                <Icon name="phone" size={18} color="#4b5563" style={{ marginRight: 6 }} />
                <Text className="text-gray-700 text-base">{c.phone}</Text>
              </View>
            )}

            {/* Contact Person */}
            {c.contactPerson && (
              <View className="flex-row items-center mb-1">
                <Icon name="person" size={18} color="#4b5563" style={{ marginRight: 6 }} />
                <Text className="text-gray-700 text-base">{c.contactPerson}</Text>
              </View>
            )}

            {/* Registered Date */}
            {c.registeredDate && (
              <View className="mt-3 border-t border-gray-100 pt-2">
                <Text className="text-gray-500 text-sm">
                  Registered: {formatDate(c.registeredDate)}
                </Text>
              </View>
            )}
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
            customers={branches}
            setFilteredData={setFilteredData}
            closeModal={() => setFilterModal(false)}
          />
        </View>
      </Modal>
    </View>
  );
}
