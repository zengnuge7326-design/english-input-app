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
  },
};

export default config;
