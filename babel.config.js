module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          '@': './src',
          '@api': './src/api',
          '@assets': './src/assets',
          '@interface': './src/interface',
          '@modules': './src/modules',
          '@materials': './src/materials',
          '@navigation': './src/navigation',
          '@screens': './src/screens',
          '@style': './src/style',
          '@utils': './src/utils',
        },
      },
    ],
    "react-native-reanimated/plugin"
  ],
};
