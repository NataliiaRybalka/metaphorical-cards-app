module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: [__dirname],
        alias: {
          '@': __dirname,
        },
      },
    ],
    'react-native-worklets/plugin',
  ],
};
