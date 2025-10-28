import React, { useEffect, useRef } from 'react';
import {
  View,
  Image,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Loader'>;

const loaderHTML = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      html, body {
        margin: 0;
        padding: 0;
        background: transparent;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }

      .loader {
        display: flex;
        gap: 8px;
      }

      .loader .dot {
        height: 20px;
        width: 20px;
        border-radius: 50%;
        border: 2px solid #e8e8e8;
        background: #16b0c1;
        animation: jump 0.8s ease-in-out infinite alternate;
      }

      @keyframes jump {
        100% {
          background: #661e92;
          transform: translateZ(-3rem) scale(1.9);
        }
      }

      .loader .dot:nth-child(1) { animation-delay: 0.1s; }
      .loader .dot:nth-child(2) { animation-delay: 0.2s; }
      .loader .dot:nth-child(3) { animation-delay: 0.3s; }
      .loader .dot:nth-child(4) { animation-delay: 0.4s; }
      .loader .dot:nth-child(5) { animation-delay: 0.5s; }
    </style>
  </head>
  <body>
    <div class="loader">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
  </body>
</html>
`;

export default function LoaderScreen({ navigation }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      const firstLaunch = true;
      if (firstLaunch) {
        navigation.replace('Onboarding');
      } else {
        navigation.replace('Menu');
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, navigation]);

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.centerWrapper}>
        <Animated.Image
          source={require('../assets/pic_loader.png')}
          style={[
            styles.loaderImage,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
          resizeMode="contain"
        />
      </View>

      <View style={styles.webWrapper}>
        <WebView
          originWhitelist={['*']}
          source={{ html: loaderHTML }}
          style={styles.webview}
          backgroundColor="transparent"
          androidHardwareAccelerationDisabled={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scrollEnabled={false}
        />
      </View>
    </ImageBackground>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  centerWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderImage: {
    width: 200,
    height: 200,
  },
  webWrapper: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  webview: {
    width: width,
    height: 80,
    backgroundColor: 'transparent',
  },
});
