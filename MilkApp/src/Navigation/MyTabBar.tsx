import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MyTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Choose icons based on route
        let iconName = '';
        if (route.name === 'HomeScreen') iconName = 'home';
        else if (route.name === 'OrderScreen') iconName = 'event';
        else if (route.name === 'ProfileScreen') iconName = 'person';

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={styles.tabItemWrapper}
          >
            <View style={[styles.tabItem, isFocused && styles.activeTab]}>
              <Icon
                name={iconName}
                size={22}
                color={isFocused ? '#FFFFFF' : '#333'}
              />
              {isFocused && (
                <Text style={[styles.label, { color: '#ffffff' }]}>
                  {label as string}
                </Text>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopColor: '#eee',
    borderTopWidth: 1,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  tabItemWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#000000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4, 
    borderRadius: 20,

  },
  label: {
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default MyTabBar;
