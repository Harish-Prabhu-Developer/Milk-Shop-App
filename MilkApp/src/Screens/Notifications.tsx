// Notifications.tsx
import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import moment from "moment";
import { AppDispatch, RootState } from "@Redux/Store";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "@Redux/Auth/authSlice";

const Notifications = () => {
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Use Redux state
  const { notifications, loading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    dispatch(fetchNotifications()); // ✅ Call thunk on mount
  }, [dispatch]);

  // Group Notifications by date
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


  if (notifications.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Ionicons name="notifications-off" size={48} color="#9ca3af" />
        <Text className="text-gray-400 text-lg mt-2">No Notifications</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle={"light-content"} backgroundColor="#2563eb" />
      {loading && (
        <View className="absolute top-0 left-0 right-0 bottom-0 flex-row gap-4 items-center justify-center bg-black/45 z-50">
          <ActivityIndicator size="large" color="#3D8BFD" />
          <Text className="text-white text-lg font-bold my-1">
            Loading...
          </Text>
        </View>
      )}
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
                  key={item._id} // ✅ FIXED: use _id instead of id
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
