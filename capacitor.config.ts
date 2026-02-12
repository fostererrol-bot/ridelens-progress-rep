import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.2d0d28c1987c424c87c5b6b7c1d1c74b',
  appName: 'RideLens',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      launchFadeOutDuration: 500,
      backgroundColor: '#1a1a2e',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
      splashImmersive: true,
    },
  },
};

export default config;
