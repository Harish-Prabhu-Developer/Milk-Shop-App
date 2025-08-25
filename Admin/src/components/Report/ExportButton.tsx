import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

interface ExportButtonProps {
  data: any[];
  onExportCSV: (data: any[]) => void;
  onExportExcel: (data: any[]) => void;
  onExportPDF: (data: any[]) => void;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  onExportCSV,
  onExportExcel,
  onExportPDF,
}) => {
  return (
    <View className="flex-row justify-between px-4 py-5 bg-white border-t border-gray-200">
      {/* CSV Button */}
      <TouchableOpacity
        onPress={() => onExportCSV(data)}
        className="flex-1 flex-row items-center justify-center bg-blue-500 mx-1 py-3 rounded-xl shadow-md"
      >
        <MaterialIcons name="file-download" size={20} color="#fff" />
        <Text className="ml-2 text-white font-semibold">CSV</Text>
      </TouchableOpacity>

      {/* Excel Button */}
      <TouchableOpacity
        onPress={() => onExportExcel(data)}
        className="flex-1 flex-row items-center justify-center bg-green-500 mx-1 py-3 rounded-xl shadow-md"
      >
        <MaterialIcons name="table-chart" size={20} color="#fff" />
        <Text className="ml-2 text-white font-semibold">Excel</Text>
      </TouchableOpacity>

      {/* PDF Button */}
      <TouchableOpacity
        onPress={() => onExportPDF(data)}
        className="flex-1 flex-row items-center justify-center bg-red-500 mx-1 py-3 rounded-xl shadow-md"
      >
        <MaterialIcons name="picture-as-pdf" size={20} color="#fff" />
        <Text className="ml-2 text-white font-semibold">PDF</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ExportButton;
