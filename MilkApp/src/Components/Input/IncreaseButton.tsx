import { Text, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';

interface IncreaseButtonProps {
  initialCount?: number; 
  OnCount: (count: number) => void; 
}

const IncreaseButton = ({ initialCount = 1, OnCount }: IncreaseButtonProps) => {
  const [count, setCount] = useState(initialCount);
  const isMounted = useRef(false);

  // Sync with parent when initialCount changes, but avoid triggering OnCount
  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  const increase = () => {
    const newCount = count + 1;
    setCount(newCount);
    OnCount(newCount); // ✅ only on user action
  };

  const decrease = () => {
    const newCount = Math.max(1, count - 1);
    setCount(newCount);
    OnCount(newCount); // ✅ only on user action
  };

  return (
    <View className="flex-row items-center justify-center border border-gray-200 px-4 py-1 rounded-xl gap-4">
      <TouchableOpacity className="bg-success px-3 py-0 rounded-lg" onPress={decrease}>
        <Text className="text-xl text-white font-bold">-</Text>
      </TouchableOpacity>

      <Text className="text-lg font-semibold">{count}</Text>

      <TouchableOpacity className="bg-success px-3 py-0 rounded-lg" onPress={increase}>
        <Text className="text-xl text-white font-bold">+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default IncreaseButton;
