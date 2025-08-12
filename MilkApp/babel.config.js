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
    [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          blocklist: null,
          allowlist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
  ],
};
