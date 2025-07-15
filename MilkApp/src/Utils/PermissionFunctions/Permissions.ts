import messaging from '@react-native-firebase/messaging';
import { Linking, PermissionsAndroid, Platform } from 'react-native';

// Request Notification Permission (Android 13+ only)
export async function requestPushNotificationPermission() {
  try {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Android notification permission granted');
      } else {
        console.log('Android notification permission denied');
        return;
      }
    }

    // Firebase Messaging permission (iOS & Android)
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
    } else {
      console.log('Firebase messaging permission denied');
    }
  } catch (error) {
    console.error('Push Notification Permission Error:', error);
  }
}


export async function requestStoragePermission() {
  try {
    if (Platform.OS !== 'android') return;

    const androidVersion = Platform.Version;

    // For Android 11 (API 30) and above
    if (androidVersion >= 30) {
      console.log('Android version:', androidVersion);
      
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'All Files Access Permission',
          message: 'We need access to manage and save files to your storage.',
          buttonPositive: 'Allow',
          buttonNegative: 'Deny',
          buttonNeutral: 'Later',
        }
      );
      console.log('granted', granted);
      

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Manage external storage permission granted');
      } else {
        console.log('Manage external storage permission denied');

        // Optional: Open settings to manually enable
        Linking.openSettings();
      }
    } else {
      // For Android < 11
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'We need access to save your invoice as a file.',
          buttonPositive: 'Allow',
          buttonNegative: 'Deny',
          buttonNeutral: 'Later',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage permission granted');
      } else {
        console.log('Storage permission denied');
      }
    }
  } catch (error) {
    console.error('Storage Permission Error:', error);
  }
}
