import type { CapacitorConfig } from '@capacitor/cli';

// 📋 INSTRUCCIONES:
// 1. Copia este archivo y renómbralo a: capacitor.config.ts
// 2. Ajusta los valores según tu configuración
// 3. NO subas capacitor.config.ts a Git

const config: CapacitorConfig = {
  appId: 'com.tuempresa.gestpharma',
  appName: 'GestPharma',
  webDir: 'www',
  
  server: {
    // Para desarrollo local con recarga en caliente, descomenta:
    // url: 'http://localhost:8100',
    // cleartext: true
  },
  
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0054e9',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    
    // Configuración de Google Sign-In
    // Obtén el serverClientId en: https://console.cloud.google.com/
    // APIs & Services → Credentials → OAuth 2.0 Client IDs
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: 'TU-CLIENT-ID.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    }
  },
  
  // Configuración de Android (para builds firmados)
  android: {
    buildOptions: {
      // keystorePath: 'path/to/your/keystore.jks',
      // keystorePassword: 'TU-PASSWORD',
      // keystoreAlias: 'TU-ALIAS',
      // keystoreAliasPassword: 'TU-ALIAS-PASSWORD',
    }
  },
  
  // Configuración de iOS
  ios: {
    scheme: 'GestPharma'
  }
};

export default config;
