// Tabs.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type TabsProps = {
  tabs: string[];
  children: React.ReactNode[];
};

const Tabs: React.FC<TabsProps> = ({ tabs, children }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <View className="flex-1 ">
      <View className="flex-row bg-gray-100 rounded-lg mx-4 mt-4 overflow-hidden shadow-md">
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            className={`flex-1 py-3 items-center justify-center ${
              activeTab === index ? 'bg-primary' : 'bg-gray-300'
            }`}
            onPress={() => setActiveTab(index)}
          >
            <Text
              className={`text-base font-medium ${
                activeTab === index ? 'text-white' : 'text-gray-800'
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="flex-1">{children[activeTab]}</View>
    </View>
  );
};

export default Tabs;
