import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MyTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const getIcon = (routeName: string) => {
    switch (routeName) {
      case 'HomeScreen':
        return 'home';
      case 'OrderScreen':
        return 'list-alt';
      case 'ProfileScreen':
        return 'person';
      default:
        return 'circle';
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 0,
        padding: 10,
        margin: 10,
        bottom:24,
        position: 'absolute',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 2.5,
        shadowOffset: { width: 0, height: -2 },
        shadowRadius: 100,
        elevation: 5,

      }}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const iconName = getIcon(route.name);
        const label = descriptors[route.key].options.tabBarLabel ?? route.name;

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

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 8,
              borderRadius: 16,
              backgroundColor: isFocused ? '#3D8BFD' : 'transparent',
              flexDirection: 'row',
              marginHorizontal: 6,
            }}
          >
            <Icon
              name={iconName}
              size={22}
              color={isFocused ? '#fff' : '#555'}
            />
            {isFocused && (
              <Text
                style={{
                  color: '#fff',
                  marginLeft: 6,
                  fontWeight: '600',
                  fontSize: 16,
                  textTransform: 'capitalize',
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                }}
              >
                {label as string}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
};

export default MyTabBar;
