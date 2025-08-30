// ProductReport.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Image,
  Modal,
  Alert,
} from "react-native";
import ReportHeader from "../../components/Report/Header/ReportHeader";
import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slices/productSlice";
import { API_URL } from "@env";
import RNFS from "react-native-fs";
import Share from "react-native-share";
import XLSX from "xlsx";
import RNHTMLtoPDF from "react-native-html-to-pdf";

import ExportButton from "../../components/Report/ExportButton";
import ProductFilterForm from "../../components/Report/Product/ProductFilterForm";
import { ProductPDFTemplate } from "../../components/Report/PDF Templates/ProductReportPDF";
import { formatDate } from "../../utils/CustomFunctions/DateFunctions";

export default function ProductReport() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [filterModal, setFilterModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: RootState) => state.product.products);

  // Fetch products once
  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        setLoading(true);
        await dispatch(fetchProducts());
      } catch (err) {
        console.log("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductsData();
  }, [dispatch]);

  // Sync redux to local state
  useEffect(() => {
    if (data?.length) {
      setProducts(data);
      setFilteredData(data);
    }
  }, [data]);

  // ---------------- EXPORT HANDLERS ----------------

const handleExportExcel = async () => {
  try {
    const rows = filteredData.map(p => ({
      Name: p.name,
      Price: p.price,
      Unit: p.unit,
      Description: p.description,
      Category: p.category,
      Status: p.isActive ? "Active" : "Inactive",
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

    // ✅ Save to Download directory (shareable)
    const path = `${RNFS.DownloadDirectoryPath}/products-${formatDate(new Date().toISOString())}.xlsx`;

    await RNFS.writeFile(path, wbout, "base64");

    await Share.open({
      url: `file://${path}`, // ✅ ensure correct prefix
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  } catch (err) {
    console.log("Excel Export error:", err);
  }
};

const handleExportCSV = async () => {
  try {
    const rows = filteredData.map(p => ({
      Name: p.name,
      Price: p.price,
      Unit: p.unit,
      Description: p.description,
      Category: p.category,
      Status: p.isActive ? "Active" : "Inactive",
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    const wbout = XLSX.write(wb, { type: "base64", bookType: "csv" });

    const path = `${RNFS.DownloadDirectoryPath}/products-${formatDate(new Date().toISOString())}.csv`;

    await RNFS.writeFile(path, wbout, "base64");

    await Share.open({
      url: `file://${path}`, // ✅ important for Android
      type: "text/csv",
    });
  } catch (err) {
    console.log("CSV Export error:", err);
  }
};

  const handleExportPDF = async () => {
    try {
      if (!filteredData.length) return Alert.alert("No data to export");
       const file = await RNHTMLtoPDF.convert({
        html: ProductPDFTemplate(filteredData),
        fileName: `Product_Report-${formatDate(new Date().toISOString())}`,
        base64: true,
      });

      await Share.open({
        url: "file://" + file.filePath,
        type: "application/pdf",
        filename: "products",
      });
    } catch (err) {
      console.log("PDF Export error:", err);
    }
  };

  // ---------------- RENDER ----------------
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-2 text-gray-600">Fetching products...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <ReportHeader
        title="Product Report"
        onFilterPress={() => setFilterModal(true)}
      />

      {/* Product List */}
      <ScrollView className="p-4 flex-1">
        {filteredData.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-gray-500 text-base font-medium">
              No products found
            </Text>
            <Text className="text-gray-400 text-sm mt-1">
              Try adjusting your filters
            </Text>
          </View>
        ) : (
          filteredData.map((p) => (
            <View
              key={p._id}
              className="bg-white rounded-3xl shadow-lg mb-5 border border-gray-100 overflow-hidden"
            >
              <View className="flex-row items-start p-4">
                {/* Product Image */}
                <View className="w-24 h-24 bg-gray-100 rounded-2xl mr-4 justify-center items-center">
                  {p.image ? (
                    <Image
                      source={{ uri: `${API_URL}/${p.image.replace(/\\/g, "/")}` }}
                      className="w-24 h-24 rounded-2xl"
                    />
                  ) : (
                    <Text className="text-gray-400 text-xs">No Image</Text>
                  )}
                </View>

                {/* Product Info */}
                <View className="flex-1">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-lg font-semibold text-gray-900">
                      {p.name}
                    </Text>
                    <Text className="text-lg font-bold text-primary">
                      ₹{p.price}
                    </Text>
                  </View>

                  <View className="flex-row items-center mb-2">
                    <Text className="text-gray-500 text-sm mr-3">{p.unit}</Text>
                    <View className="bg-blue-100 px-2 py-0.5 rounded-full">
                      <Text className="text-blue-700 text-xs font-medium">
                        {p.category}
                      </Text>
                    </View>
                  </View>

                  {!!p.description && (
                    <Text className="text-gray-600 text-sm mb-2" numberOfLines={2}>
                      {p.description}
                    </Text>
                  )}

                  {!!p.nutrition && (
                    <Text className="text-gray-500 text-xs mb-1" numberOfLines={2}>
                      Nutrition: {p.nutrition}
                    </Text>
                  )}

                  <View
                    className={`px-3 py-1 mt-2 self-end rounded-full ${
                      p.isActive ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        p.isActive ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Export Buttons */}
      {filteredData.length > 0 && (
        <ExportButton
          data={filteredData}
          onExportCSV={handleExportCSV}
          onExportExcel={handleExportExcel}
          onExportPDF={handleExportPDF}
        />
      )}

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
