// Tabs.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

type TabsProps = {
  tabs: string[];
  children: React.ReactNode[];
};

const Tabs: React.FC<TabsProps> = ({ tabs, children }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <View className="flex-1 ">
      <View className="flex-row bg-white border border-primary rounded-lg mx-4 overflow-hidden shadow-md">
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              className={`flex  items-center  justify-center ${
                activeTab === index ? 'bg-primary' : 'bg-white'
              }`}
              onPress={() => setActiveTab(index)}
            >
              <Text
                className={`text-base px-4 py-4 font-semibold ${index !== 0 && 'border-l-2'} border-primary ${
                  activeTab === index ? 'text-white' : 'text-primary'
                }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View className="flex-1">{children[activeTab]}</View>
    </View>
  );
};

export default Tabs;
