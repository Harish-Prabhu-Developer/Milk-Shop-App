module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@Components': './src/Components',
          '@Screens': './src/Screens',
          '@assets': './src/assets',
          '@Utils': './src/Utils',
          '@Constants': './src/Constants',
          '@Navigation': './src/Navigation',
          '@Redux': './src/Redux',
        },
      },
    ],
  ],
};
