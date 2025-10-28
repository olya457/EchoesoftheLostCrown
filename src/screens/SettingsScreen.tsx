import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  Switch,
  Share,
  Modal,
  Pressable,
  Alert,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useProgressStore } from '../store/progressStore';
import { useMusic } from '../context/MusicContext';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

export default function SettingsScreen() {
  const navigation = useNavigation<Nav>();

  const { musicEnabled, setMusicEnabled } = useMusic();

  const [notificationsOn, setNotificationsOn] = useState(true);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const resetAll = useProgressStore(state => state.resetAll);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, translateAnim]);

  async function handleShareApp() {
    try {
      await Share.share({
        message:
          'Join me in Echoes of the Lost Crown 👑 Download the app and uncover royal secrets.',
      });
    } catch {}
  }

  function handleAskReset() {
    setShowConfirmReset(true);
  }

  async function handleConfirmResetYes() {
    if (isResetting) return;
    setIsResetting(true);
    try {
      await resetAll();
      setShowConfirmReset(false);
      Alert.alert(
        'Reset complete',
        'Your royal journey has been erased.',
        [{ text: 'OK' }],
      );
    } finally {
      setIsResetting(false);
    }
  }

  function handleConfirmResetNo() {
    setShowConfirmReset(false);
  }

  function handleToggleMusic(nextOn: boolean) {
    setMusicEnabled(nextOn);
  }

  return (
    <ImageBackground
      source={require('../assets/background_1.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.dimOverlay} />

      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Settings</Text>

        <TouchableOpacity
          style={styles.menuButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Menu')}
        >
          <Image
            source={require('../assets/menu_burger.png')}
            style={styles.menuIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[
          styles.animatedWrapper,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateAnim }],
          },
        ]}
      >
        <View style={styles.cardWrapper}>
          <SettingsRow
            label="Music"
            rightComponent={
              <Switch
                value={musicEnabled}
                onValueChange={handleToggleMusic}
                trackColor={{ false: '#555', true: '#4da6ff' }}
                thumbColor="#fff"
              />
            }
          />

          <SettingsRow
            label="Notifications"
            rightComponent={
              <Switch
                value={notificationsOn}
                onValueChange={setNotificationsOn}
                trackColor={{ false: '#555', true: '#4da6ff' }}
                thumbColor="#fff"
              />
            }
          />

          <SettingsRow
            label="Reset Progress"
            rightComponent={
              <TouchableOpacity
                style={styles.iconBtn}
                activeOpacity={0.7}
                onPress={handleAskReset}
              >
                <Image
                  source={require('../assets/icon_reset.png')}
                  style={styles.iconImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            }
          />

          <SettingsRow
            label="Share App"
            rightComponent={
              <TouchableOpacity
                style={styles.iconBtn}
                activeOpacity={0.7}
                onPress={handleShareApp}
              >
                <Image
                  source={require('../assets/share_icon.png')}
                  style={styles.iconImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            }
          />
        </View>
      </Animated.View>

      <Modal
        visible={showConfirmReset}
        transparent
        animationType="fade"
        onRequestClose={handleConfirmResetNo}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmText}>
              Do you truly wish to{'\n'}erase your royal{'\n'}journey?
            </Text>

            <View style={styles.confirmButtonsRow}>
              <Pressable
                disabled={isResetting}
                style={[
                  styles.confirmBtn,
                  styles.confirmBtnYes,
                  isResetting && styles.confirmBtnDisabled,
                ]}
                onPress={handleConfirmResetYes}
              >
                <Text style={styles.confirmBtnYesText}>
                  {isResetting ? '...' : 'Yes'}
                </Text>
              </Pressable>

              <Pressable
                disabled={isResetting}
                style={[
                  styles.confirmBtn,
                  styles.confirmBtnNo,
                  isResetting && styles.confirmBtnDisabled,
                ]}
                onPress={handleConfirmResetNo}
              >
                <Text style={styles.confirmBtnNoText}>No</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

function SettingsRow({
  label,
  rightComponent,
}: {
  label: string;
  rightComponent: React.ReactNode;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>{rightComponent}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  headerBar: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  menuButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    width: 18,
    height: 18,
    tintColor: '#fff',
  },
  animatedWrapper: {
    flex: 1,
  },
  cardWrapper: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginHorizontal: 20,
    marginTop: 62,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.15)',
  },
  rowLabel: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: 18,
    height: 18,
    tintColor: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  confirmBox: {
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    paddingHorizontal: 16,
    paddingVertical: 16,
    minWidth: 260,
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  confirmButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 12,
  },
  confirmBtn: {
    minWidth: 64,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  confirmBtnYes: {
    backgroundColor: '#8B0000',
    borderColor: '#ff4d4d',
  },
  confirmBtnNo: {
    backgroundColor: '#003400',
    borderColor: '#4dff4d',
  },
  confirmBtnDisabled: {
    opacity: 0.5,
  },
  confirmBtnYesText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  confirmBtnNoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});
