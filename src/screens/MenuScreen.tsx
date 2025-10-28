import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Menu'>;

const { width } = Dimensions.get('window');

type MenuItem = {
  key: string;
  label: string;
  route: keyof RootStackParamList;
};

const MENU_ITEMS: MenuItem[] = [
  { key: 'Map', label: 'Map', route: 'Map' },
  { key: 'List', label: 'List of Places', route: 'LocationsList' },
  { key: 'Favorite', label: 'Favorite Places', route: 'Favorite' },
  { key: 'Tracking', label: 'Tracking', route: 'Tracking' },
  { key: 'Achievements', label: 'Achievements', route: 'Achievements' },
  { key: 'Settings', label: 'Setup', route: 'Settings' },
];

let lastActiveKey = MENU_ITEMS[0].key;

export default function MenuScreen({ navigation }: Props) {
 
  const [activeKey, setActiveKey] = useState<string>(lastActiveKey);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    translateAnim.setValue(20);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, translateAnim]);

  const handlePress = (itemKey: string, routeName: keyof RootStackParamList) => {
    lastActiveKey = itemKey;
    setActiveKey(itemKey);

    navigation.navigate({ name: routeName } as any);
  };

  return (
    <ImageBackground
      source={require('../assets/background_1.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <Animated.View
        style={[
          styles.wrapper,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateAnim }],
          },
        ]}
      >
        <View style={styles.headerWrapper}>
          <Text style={styles.headerText}>MENU</Text>
        </View>

        <View style={styles.menuBlock}>
          {MENU_ITEMS.map(item => {
            const isActive = item.key === activeKey;
            return (
              <MenuButton
                key={item.key}
                label={item.label}
                active={isActive}
                onPress={() => handlePress(item.key, item.route)}
              />
            );
          })}
        </View>

        <View style={styles.homeIndicatorWrapper}>
          <View style={styles.homeIndicator} />
        </View>
      </Animated.View>
    </ImageBackground>
  );
}

function MenuButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  if (active) {
    return (
      <TouchableOpacity
        style={styles.activeBtnWrapper}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <ImageBackground
          source={require('../assets/menu_active_bg.png')}
          style={styles.activeBtnBg}
          imageStyle={styles.activeBtnBgImage}
          resizeMode="stretch"
        >
          <Text style={styles.activeBtnText}>{label}</Text>
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.inactiveBtnWrapper}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.inactiveBtnBg}>
        <Text style={styles.inactiveBtnText}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  wrapper: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  headerWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    marginBottom: 32,
  },

  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
  },

  menuBlock: {
    width: '100%',
  },

  activeBtnWrapper: {
    width: '100%',
    marginBottom: 20,
  },

  activeBtnBg: {
    minHeight: 48,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  activeBtnBgImage: {
    borderRadius: 6,
  },

  activeBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },

  inactiveBtnWrapper: {
    width: '100%',
    marginBottom: 20,
  },

  inactiveBtnBg: {
    minHeight: 48,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  inactiveBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },

  homeIndicatorWrapper: {
    marginTop: 24,
    alignItems: 'center',
    width: '100%',
  },

  homeIndicator: {
    width: width * 0.4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.9)',
    marginBottom: 24,
  },
});
