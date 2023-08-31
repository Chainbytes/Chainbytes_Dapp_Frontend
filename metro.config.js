const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  crypto: require.resolve('crypto-browserify'),
  fs: require.resolve('expo-file-system'),
  http: require.resolve('stream-http'),
  https: require.resolve('https-browserify'),
  net: require.resolve('react-native-tcp'),
  os: require.resolve('os-browserify/browser.js'),
  path: require.resolve('path-browserify'),
  stream: require.resolve('readable-stream'),
  vm: require.resolve('vm-browserify'),
};

module.exports = config;