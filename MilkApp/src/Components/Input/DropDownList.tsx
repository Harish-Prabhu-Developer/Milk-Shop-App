import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface ItemType {
  [key: string]: any;
}

interface DropdownProps {
  BoxLabel: string;
  data: ItemType[];
  labelField: string; // e.g., "name", "label"
  valueField: string; // e.g., "id", "value"
  onSelect?: (item: ItemType) => void;
}

const DropdownComponent: React.FC<DropdownProps> = ({
  BoxLabel,
  data,
  labelField,
  valueField,
  onSelect,
}) => {
  const [value, setValue] = useState<string | null>(null);
  const [isFocus, setIsFocus] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'blue' }]}>
          {BoxLabel}
        </Text>
      );
    }
    return null;
  };

  const filteredData = data.filter((item) =>
    item[labelField].toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabel =
    data.find((d) => d[valueField] === value)?.[labelField] ?? 'Select item';

  return (
    <View style={styles.container} className="bg-gray-50 border-gray-300 rounded-md">
      {renderLabel()}
      <TouchableOpacity
        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
        className="py-5"
        onPress={() => {
          setIsFocus(true);
          setModalVisible(true);
        }}
      >
        <AntDesign
          style={styles.icon}
          color={isFocus ? 'black' : '#3D8BFD'}
          name="Safety"
          size={20}
        />
        <Text style={styles.selectedTextStyle}>{selectedLabel}</Text>
      </TouchableOpacity>

      <Modal transparent visible={modalVisible} animationType="fade">
        <TouchableOpacity
          className="flex-1 justify-center items-center bg-black/50"
          activeOpacity={1}
          onPressOut={() => {
            setModalVisible(false);
            setIsFocus(false);
            setSearch('');
          }}
        >
          <View className="bg-white w-4/5 rounded-lg absolute max-h-[300px] p-2">
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item[valueField].toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="px-4 py-2"
                  onPress={() => {
                    setValue(item[valueField]);
                    setModalVisible(false);
                    setIsFocus(false);
                    setSearch('');
                    onSelect?.(item); // optional callback
                  }}
                >
                  <Text className="text-lg text-gray-600 p-4 border rounded-lg">
                    {item[labelField]}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  dropdown: {
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: -8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    color: 'gray',
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
    borderRadius: 6,
  },
});
