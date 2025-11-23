let secrets = {};

try {
  // eslint-disable-next-line global-require, import/no-unresolved
  secrets = require('./secrets.js');
} catch (error) {
  secrets = {};
}

const timobotApiKey =
  secrets.TIMOBOT_API_KEY ??
  process.env.EXPO_PUBLIC_TIMOBOT_API_KEY ??
  process.env.TIMOBOT_API_KEY ??
  '';

const perplexityProxyUrl =
  secrets.PERPLEXITY_PROXY_URL ??
  process.env.EXPO_PUBLIC_PERPLEXITY_PROXY_URL ??
  process.env.PERPLEXITY_PROXY_URL ??
  'https://backend-timobot.vercel.app';

const huggingFaceToken =
  secrets.HUGGING_FACE_TOKEN ??
  process.env.EXPO_PUBLIC_HUGGING_FACE_TOKEN ??
  process.env.HUGGING_FACE_TOKEN ??
  '';

module.exports = {
  expo: {
    name: 'TimoBot',
    slug: 'timobot',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.timobot.app',
      infoPlist: {
        NSMicrophoneUsageDescription: 'TimoBot necesita acceso al micrófono para la entrada de voz',
        NSSpeechRecognitionUsageDescription: 'TimoBot usa reconocimiento de voz para transcribir audio',
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.timobot.app',
      permissions: ['RECORD_AUDIO'],
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: ['expo-font', 'expo-sqlite'],
    extra: {
      timobotApiKey,
      perplexityProxyUrl,
      huggingFaceToken,
    },
  },
};
