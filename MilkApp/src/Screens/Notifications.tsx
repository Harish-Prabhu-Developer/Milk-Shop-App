// Notifications.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import moment from "moment";

const Notifications = () => {
  // Example Data
  const [notifications] = useState([
    {
      id: "1",
      title: "New Order Placed",
      message: "Order ORD202508281245 has been placed successfully.",
      date: "2025-08-28T12:45:00.000Z", // Today
      type: "order",
    },
    {
      id: "2",
      title: "Payment Completed",
      message: "Order ORD202508271110 payment was successful.",
      date: "2025-08-27T11:10:00.000Z", // Yesterday
      type: "payment",
    },
    {
      id: "3",
      title: "Order Processing",
      message: "Order ORD202508271250 is being prepared for delivery.",
      date: "2025-08-27T12:50:00.000Z", // Yesterday
      type: "processing",
    },
    {
      id: "4",
      title: "Order Delivered",
      message: "Order ORD202508251045 has been delivered.",
      date: "2025-08-25T10:45:00.000Z", // Monday
      type: "delivery",
    },
  ]);

  // Group Notifications
  const groupByDate = () => {
    const today = moment().startOf("day");
    const yesterday = moment().subtract(1, "days").startOf("day");

    return notifications.reduce((groups: any, item) => {
      const date = moment(item.date).startOf("day");
      let key = "";

      if (date.isSame(today)) key = "Today";
      else if (date.isSame(yesterday)) key = "Yesterday";
      else key = date.format("dddd, DD MMM YYYY");

      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
      return groups;
    }, {});
  };

  const groupedNotifications = groupByDate();

  const renderIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Ionicons name="cart" size={22} color="#2563eb" />;
      case "payment":
        return <Ionicons name="card" size={22} color="#16a34a" />;
      case "delivery":
        return <Ionicons name="cube" size={22} color="#f59e0b" />;
      case "processing":
        return <Ionicons name="time-outline" size={22} color="#eab308" />;
      default:
        return <Ionicons name="notifications" size={22} color="#6b7280" />;
    }
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case "order":
        return { bg: "bg-blue-100", text: "text-blue-700" };
      case "payment":
        return { bg: "bg-green-100", text: "text-green-700" };
      case "delivery":
        return { bg: "bg-orange-100", text: "text-orange-700" };
      case "processing":
        return { bg: "bg-yellow-100", text: "text-yellow-700" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-700" };
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle={"light-content"} backgroundColor="#f9fafb" />

      {/* Header */}
      <View className="px-6 py-5 bg-primary border-b border-gray-200 shadow-sm">
        <View className="flex-row items-center pt-6 justify-center">
          <Ionicons name="notifications" size={26} color="#ffffff" />
          <Text className="text-2xl font-bold text-white ml-2">
            Notifications
          </Text>
        </View>
      </View>

      {/* Notification List */}
      <ScrollView className="flex-1 px-4 py-6">
        {Object.keys(groupedNotifications).map((dateKey) => (
          <View key={dateKey} className="mb-8">
            {/* Section Header */}
            <Text className="text-sm font-semibold text-gray-500 mb-3 border-b border-gray-200 pb-1">
              {dateKey}
            </Text>

            {groupedNotifications[dateKey].map((item: any) => {
              const badge = getBadgeStyle(item.type);
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.9}
                  className="flex-row items-start bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100"
                >
                  {/* Icon */}
                  <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mr-4">
                    {renderIcon(item.type)}
                  </View>

                  {/* Text Content */}
                  <View className="flex-1">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-base font-semibold text-gray-900 flex-1">
                        {item.title}
                      </Text>

                      {/* Badge */}
                      <View className={`px-3 py-1 rounded-full ${badge.bg}`}>
                        <Text className={`text-xs font-medium ${badge.text}`}>
                          {item.type.toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    <Text className="text-sm text-gray-600 mt-1">
                      {item.message}
                    </Text>
                    <Text className="text-xs text-gray-400 mt-2">
                      {moment(item.date).format("hh:mm A")}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Notifications;
