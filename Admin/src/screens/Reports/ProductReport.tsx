// ProductReport.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Image,
  Modal,
} from 'react-native';
import ReportHeader from '../../components/Report/Header/ReportHeader';
import { AppDispatch, RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/slices/productSlice';
import { API_URL } from '@env';
import * as XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

import ExportButton from '../../components/Report/ExportButton';
import ProductFilterForm from '../../components/Report/Product/ProductFilterForm';

export default function ProductReport() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [filterModal, setFilterModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: RootState) => state.product.products);

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        await dispatch(fetchProducts());
      } catch (err) {
        console.log('Error fetching products:', err);
      }
    };
    fetchProductsData();
  }, [dispatch]);

  useEffect(() => {
    setProducts(data);
    setFilteredData(data); // default show all
    setLoading(false);
  }, [data]);

  // ProductReport.tsx (inside your component)

  // --- EXPORT HANDLERS ---

  // Export to CSV
  const handleExportCSV = async () => {
    try {
      if (!filteredData.length) return;
      const header = Object.keys(filteredData[0]).join(',') + '\n';
      const rows = filteredData
        .map(row => Object.values(row).join(','))
        .join('\n');

      const csv = header + rows;
      const path = `${RNFS.DocumentDirectoryPath}/products.csv`;
      await RNFS.writeFile(path, csv, 'utf8');

      await Share.open({
        url: 'file://' + path,
        type: 'text/csv',
        filename: 'products',
      });
    } catch (err) {
      console.log('CSV Export error:', err);
    }
  };

  // Export to Excel
  const handleExportExcel = async () => {
    try {
      if (!filteredData.length) return;
      const ws = XLSX.utils.json_to_sheet(filteredData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Products');
      const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

      const path = `${RNFS.DocumentDirectoryPath}/products.xlsx`;
      await RNFS.writeFile(path, wbout, 'base64');

      await Share.open({
        url: 'file://' + path,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        filename: 'products',
      });
    } catch (err) {
      console.log('Excel Export error:', err);
    }
  };

  // Export to PDF
  const handleExportPDF = async () => {
    try {
      if (!filteredData.length) return;
      let html = `
      <h1>Product Report</h1>
      <table border="1" cellspacing="0" cellpadding="5">
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Unit</th>
          <th>Category</th>
        </tr>
        ${filteredData
          .map(
            p => `
          <tr>
            <td>${p.name}</td>
            <td>₹${p.price}</td>
            <td>${p.unit}</td>
            <td>${p.category}</td>
          </tr>
        `,
          )
          .join('')}
      </table>
    `;

      const file = await RNHTMLtoPDF.convert({
        html,
        fileName: 'products',
        base64: true,
      });

      await Share.open({
        url: 'file://' + file.filePath,
        type: 'application/pdf',
        filename: 'products',
      });
    } catch (err) {
      console.log('PDF Export error:', err);
    }
  };

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <ReportHeader
        title="Product Report"
        onFilterPress={() => setFilterModal(true)}
      />

      {/* Product List */}
      <ScrollView className="p-4">
        {filteredData.map(p => (
          <View
            key={p._id}
            className="bg-white rounded-3xl shadow-lg mb-5 border border-gray-100 overflow-hidden"
          >
            <View className="flex-row items-center p-4">
              {/* Product Image */}
              <View className="w-24 h-24 bg-gray-100 rounded-2xl mr-4 justify-center items-center">
                <Image
                  source={{ uri: `${API_URL}/${p.image}` }}
                  className="w-24 h-24 rounded-2xl"
                />
              </View>

              {/* Product Info */}
              <View className="flex-1">
                {/* Name + Price */}
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-lg font-semibold text-gray-900">
                    {p.name}
                  </Text>
                  <Text className="text-lg font-bold text-primary">
                    ₹{p.price}
                  </Text>
                </View>

                {/* Unit + Category */}
                <View className="flex-row items-center mb-2">
                  <Text className="text-gray-500 text-sm mr-3">{p.unit}</Text>
                  <View className="bg-blue-100 px-2 py-0.5 rounded-full">
                    <Text className="text-blue-700 text-xs font-medium">
                      {p.category}
                    </Text>
                  </View>
                </View>

                {/* Description */}
                <Text className="text-gray-600 text-sm mb-2" numberOfLines={1}>
                  {p.description}
                </Text>

                {/* Nutrition */}
                <Text className="text-gray-500 text-xs mb-1" numberOfLines={1}>
                  Nutrition: {p.nutrition}
                </Text>

                {/* Status */}
                <View
                  className={`px-3 py-1 mt-2 self-end rounded-full ${
                    p.isActive ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      p.isActive ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {p.isActive ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Export Buttons */}
      <ExportButton
        data={filteredData}
        onExportCSV={handleExportCSV}
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
      />

      {/* Filter Modal */}
      <Modal visible={filterModal} animationType="slide" transparent={true}>
        <View className="flex-1 bg-black/50 justify-end">
          <ProductFilterForm
            products={products}
            setFilteredData={setFilteredData}
            closeModal={() => setFilterModal(false)}
          />
        </View>
      </Modal>
    </View>
  );
}
