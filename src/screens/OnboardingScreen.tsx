import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: 0,
    girl: require('../assets/girl_step1.png'),
    title: 'Welcome to the Cops N Robbers ',
    text:
      "Step into Edinburgh’s past and uncover the stories of kings, queens, and the echoes they left behind.",
    buttonText: 'Next',
  },
  {
    id: 1,
    girl: require('../assets/girl_step2.png'),
    title: 'Explore and Discover',
    text:
      "Follow the interactive map and visit 10 historical landmarks. Each one holds a piece of royal history waiting to be revealed.",
    buttonText: 'Next',
  },
  {
    id: 2,
    girl: require('../assets/girl_step3.png'),
    title: 'Confirm and Unlock',
    text:
      "Mark the places you’ve visited to unlock hidden royal facts — secrets that connect the city’s past to your journey.",
    buttonText: 'Proceed',
  },
  {
    id: 3,
    girl: require('../assets/girl_step4.png'),
    title: 'Track Your Journey',
    text:
      "View your progress, achievements, and favorite spots. Every step brings you closer to the heart of Edinburgh’s royal legacy.",
    buttonText: 'Begin',
  },
];

const HERO_HEIGHT = height * 0.48;
const CONTENT_TOP_OFFSET = 50;

const GIRL_WIDTH = width * 0.6;
const GIRL_HEIGHT = HERO_HEIGHT * 0.9;

const BASE_CARD_OVERLAP = 32;

const DEEP_CARD_OVERLAP = 52; 
const GIRL_DOWN_SHIFT = 24;   

export default function OnboardingScreen({ navigation }: Props) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  const isDeepOverlap = slide.id === 2;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    translateAnim.setValue(20);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 280,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, fadeAnim, translateAnim]);

  const handlePress = () => {
    if (index < slides.length - 1) {
      setIndex(index + 1);
    } else {
      navigation.replace('Menu');
    }
  };

  const heroWrapperStyle = [
    styles.heroWrapper,
    isDeepOverlap && { paddingBottom: 0 },
  ];

  const girlImageStyle = [
    styles.girlImage,
    isDeepOverlap && { transform: [{ translateY: GIRL_DOWN_SHIFT }] },
  ];

  const cardWrapperStyle = [
    styles.cardWrapper,
    { marginTop: -(isDeepOverlap ? DEEP_CARD_OVERLAP : BASE_CARD_OVERLAP) },
  ];

  return (
    <ImageBackground
      source={require('../assets/background_1.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateAnim }],
          },
        ]}
      >
       
        <View style={heroWrapperStyle}>
          <Image
            source={slide.girl}
            style={girlImageStyle}
            resizeMode="contain"
          />
        </View>

        <View style={cardWrapperStyle}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{slide.title}</Text>
            <Text style={styles.cardText}>{slide.text}</Text>
          </View>
        </View>

        <View style={styles.ctaWrapper}>
          <TouchableOpacity
            style={styles.buttonWrapper}
            onPress={handlePress}
            activeOpacity={0.8}
          >
            <Image
              source={require('../assets/button_bg.png')}
              style={styles.buttonBg}
              resizeMode="stretch"
            />
            <Text style={styles.buttonText}>{slide.buttonText}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressWrapper}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: ((index + 1) / slides.length) * (width * 0.4) },
              ]}
            />
          </View>
        </View>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  content: {
    flex: 1,
    paddingTop: CONTENT_TOP_OFFSET,
    justifyContent: 'flex-start',
  },

  heroWrapper: {
    height: HERO_HEIGHT,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  girlImage: {
    width: GIRL_WIDTH,
    height: GIRL_HEIGHT,
  },

  cardWrapper: {
    paddingHorizontal: 24,
  },

  card: {
    width: '100%',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 28,
    backgroundColor: '#1B1B1F', 
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },

  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },

  cardText: {
    color: '#DDDDDD',
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
  },

  ctaWrapper: {
    paddingTop: 24,
    alignItems: 'center',
  },

  buttonWrapper: {
    width: 130,
    height: 44,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonBg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  progressWrapper: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 24,
  },

  progressTrack: {
    width: '40%',
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
});
