import { Text, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';

interface IncreaseButtonProps {
  initialCount?: number; // Allow external count setter
  OnCount: (count: number) => void; // Callback to expose count
}

const IncreaseButton = ({ initialCount = 1, OnCount }: IncreaseButtonProps) => {
  const [count, setCount] = useState(initialCount);

  // Sync internal count when initialCount changes from parent
  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  // Notify parent whenever count changes
  useEffect(() => {
    OnCount(count);
  }, [count, OnCount]);

  const increase = () => setCount((prev) => prev + 1);
  const decrease = () => setCount((prev) => Math.max(1, prev - 1));

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
