import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Image } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { StatusBar } from 'react-native';

type HeaderProps = {
  title: string;
};
const Header = ({ title }: HeaderProps) => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  return (
    <>
      <StatusBar barStyle={'light-content'} />
      <View className="bg-primary pt-14 pb-6 px-6 flex-row gap-4 items-center w-full">
        {/* Profile Image */}
        <TouchableOpacity
          className="bg-white rounded-full w-10 h-10"
          onPress={() => navigation.openDrawer()}
        >
          <Image
            source={require('../assets/Images/Profile.png')}
            className="w-full h-full rounded-full p-2"
          />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-white text-center items-center justify-center">
          {title}
        </Text>
      </View>
    </>
  );
};

export default Header;

const styles = StyleSheet.create({});
