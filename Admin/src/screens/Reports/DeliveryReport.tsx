import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import ReportHeader from '../../components/Report/Header/ReportHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import ExportButton from '../../components/Report/ExportButton';
import XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import DeliveryFilterForm from '../../components/Report/Delivery/DeliveryFilterForm';
import axios from 'axios';
import { API_URL } from '@env';
import { DeliveryPDFTemplate } from '../../components/Report/PDF Templates/DeilveryReportPDF';
import { formatDate } from '../../utils/CustomFunctions/DateFunctions';

const DeliveryReport = () => {
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [filterModal, setFilterModal] = useState(false);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const StatusColors: { [key: string]: string } = {
    Delivered: '#4caf50',
    Processing: '#2196f3', // ✅ fixed
    Pending: '#ff9800',
    Cancelled: '#f44336',
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'check-circle';
      case 'Pending':
        return 'schedule'; // ✅ valid
      case 'Processing':
        return 'hourglass-empty'; // ✅ valid
      case 'Cancelled':
        return 'cancel';
      default:
        return 'error';
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const response = await axios.get(`${API_URL}/milkapp/reports/delivery`);
      setDeliveries(response.data || []);
    } catch (err) {
      console.log('Error fetching delivery report:', err);
      Alert.alert('Error', 'Failed to load delivery report');
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
      if (exportData.length === 0) return Alert.alert('No data to export');
      const cleanRows = exportData.map((r: any) => ({
        "Branch Name": r.branchName,
        RouteGroup: r.routeGroup,
        VehicleType: r.vehicleType,
        location: r.location,
        distance:r.distance,
        "Order ID": r.orderId,
        "Status": r.orderStatus,
        "Total Amount": r.totalAmount,
      }));
      const ws = XLSX.utils.json_to_sheet(cleanRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Delivery');
      const wbout = XLSX.write(wb, { type: 'base64', bookType: 'csv' });

      const path = `${RNFS.DownloadDirectoryPath}/delivery-${formatDate(new Date().toISOString())}.csv`;

      await RNFS.writeFile(path, wbout, 'base64');

      await Share.open({
        url: `file://${path}`, // ✅ important for Android
        type: 'text/csv',
      });
    } catch (err) {
      Alert.alert('Error', 'Failed to export CSV');
      console.log(err);
    }
  };

  const handleExportExcel = async () => {
    try {
      const exportData = filteredData.length > 0 ? filteredData : deliveries;
      if (exportData.length === 0) return Alert.alert('No data to export');
      const cleanRows = exportData.map((r: any) => ({
        "Branch Name": r.branchName,
        RouteGroup: r.routeGroup,
        VehicleType: r.vehicleType,
        location: r.location,
        distance:r.distance,
        "Order ID": r.orderId,
        "Status": r.orderStatus,
        "Total Amount": r.totalAmount,
      }));
      const ws = XLSX.utils.json_to_sheet(cleanRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Delivery');
      const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

      // ✅ Save to Download directory (shareable)
      const path = `${RNFS.DownloadDirectoryPath}/delivery-${formatDate(new Date().toISOString())}.xlsx`;

      await RNFS.writeFile(path, wbout, 'base64');

      await Share.open({
        url: `file://${path}`, // ✅ ensure correct prefix
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
    } catch (err) {
      Alert.alert('Error', 'Failed to export Excel');
      console.log(err);
    }
  };

  const handleExportPDF = async () => {
    try {
      const exportData = filteredData.length > 0 ? filteredData : deliveries;
      if (exportData.length === 0) return Alert.alert('No data to export');

      const file = await RNHTMLtoPDF.convert({
        html: DeliveryPDFTemplate(exportData),
        fileName: `Deilvery_Report-${formatDate(new Date().toISOString())}`,
        base64: true,
      });

      await Share.open({ url: `file://${file.filePath}` });
    } catch (err) {
      Alert.alert('Error', 'Failed to export PDF');
      console.log(err);
    }
  };

  if (loading)
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text className="mt-2 text-gray-600">Loading Reports...</Text>
      </View>
    );

  return (
    <View className="flex-1 bg-gray-50">
      <ReportHeader
        title="Delivery Report"
        onFilterPress={() => setFilterModal(true)}
      />

      <ScrollView className="p-4">
        {(filteredData.length > 0 ? filteredData : deliveries).map((d,index) => (
          <View
            key={index||d._id}
            className="bg-white rounded-3xl mb-6 shadow-lg border border-gray-300 overflow-hidden"
          >
            <LinearGradient
              colors={['#3D8BFD', '#2563eb']}
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
                  Distance:{' '}
                  <Text className="font-semibold text-gray-800">
                    {d.distance}
                  </Text>
                </Text>
              </View>

              {/* Branch */}
              <View className="flex-row items-center">
                <View className="bg-gray-100 p-2 rounded-full shadow-sm">
                  <Icon name="apartment" size={20} color="#374151" />
                </View>
                <Text className="ml-3 text-gray-700 text-sm">
                  Branch:{' '}
                  <Text className="font-semibold text-gray-900">
                    {d.branchName}
                  </Text>
                </Text>
              </View>

              <View className="h-[1px] bg-gray-200 my-2" />

              {/* Order Info */}
              <View className="flex-row justify-between items-center">
                <View>
                  <View className="flex-row items-center mb-2">
                    <Icon name="receipt" size={18} color="#374151" />
                    <Text className="ml-2 text-gray-800 text-sm">
                      Order ID:{' '}
                      <Text className="font-semibold">{d.orderId}</Text>
                    </Text>
                  </View>

                  <View className="flex-row items-center px-3 py-1 rounded-lg shadow-sm">
                    <Icon name="currency-rupee" size={16} color="#15803d" />
                    <Text className="ml-1 text-green-800 text-sm font-bold">
                      ₹{d.totalAmount}
                    </Text>
                  </View>
                </View>

                {/* Status */}
                <View className="flex-row items-center px-4 py-1 rounded-full shadow-sm bg-gray-50">
                  <Icon
                    name={getStatusIcon(d.orderStatus)}
                    size={18}
                    color={StatusColors[d.orderStatus] || '#6b7280'}
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

      <ExportButton
        data={filteredData.length > 0 ? filteredData : deliveries}
        onExportCSV={handleExportCSV}
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
      />

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
};

export default DeliveryReport;
