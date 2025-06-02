
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.100dd59328f84b90bf1f697c285ac699',
  appName: 'sat-shop',
  webDir: 'dist',
  server: {
    url: 'https://100dd593-28f8-4b90-bf1f-697c285ac699.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false
    }
  }
};

export default config;
