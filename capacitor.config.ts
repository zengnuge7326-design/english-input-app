import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.englishinputapp',
  appName: '英语输入学习',
  webDir: 'dist',
  server: {
    // No live reload — use bundled dist
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    backgroundColor: '#a8d8ff',
  },
  android: {
    backgroundColor: '#a8d8ff',
  },
  plugins: {
    // 纯手机学习壳默认全屏 WebView
  },
};

export default config;
