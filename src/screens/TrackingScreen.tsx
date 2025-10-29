import React, { useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useProgressStore } from '../store/progressStore';

const { width } = Dimensions.get('window');
const BAR_MAX_WIDTH = Math.min(width - 40, 360);

function getProgressPixels(current: number, total: number) {
  if (total <= 0) return 0;
  const pct = current / total;
  const clamped = Math.min(1, Math.max(0, pct));
  return BAR_MAX_WIDTH * clamped;
}

type Nav = NativeStackNavigationProp<RootStackParamList, 'Tracking'>;

export default function TrackingScreen() {
  const navigation = useNavigation<Nav>();

  const {
    storiesTotal,
    storiesReadIds,
    locationsTotal,
    confirmedLocationIds,
    totalAchievements,
    unlockedAchievementIds,
    loadFromStorage,
  } = useProgressStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const readStoriesCount = useMemo(
    () => storiesReadIds.length,
    [storiesReadIds]
  );

  const visitedLocationsCount = useMemo(
    () => confirmedLocationIds.length,
    [confirmedLocationIds]
  );

  const achievementsUnlockedCount = useMemo(
    () => unlockedAchievementIds.length,
    [unlockedAchievementIds]
  );

  return (
    <ImageBackground
      source={require('../assets/background_1.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Tracking</Text>

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

      <View style={styles.contentWrapper}>
        <ProgressBlock
          title="Read Stories"
          subtitle="Keep reading to uncover royal secrets."
          current={readStoriesCount}
          total={storiesTotal}
        />

        <ProgressBlock
          title="Visited Locations"
          subtitle="Confirm visits to reveal hidden facts."
          current={visitedLocationsCount}
          total={locationsTotal}
        />

        <ProgressBlock
          title="Achievements Unlocked"
          subtitle="Earn royal honors for your discoveries."
          current={achievementsUnlockedCount}
          total={totalAchievements}
        />
      </View>
    </ImageBackground>
  );
}

function ProgressBlock({
  title,
  subtitle,
  current,
  total,
}: {
  title: string;
  subtitle: string;
  current: number;
  total: number;
}) {
  const isEmpty = current === 0;
  const fillWidth = getProgressPixels(current, total);

  return (
    <View style={styles.blockWrapper}>
      <Text style={styles.blockTitle}>{title}</Text>
      <Text style={styles.blockSubtitle}>{subtitle}</Text>

      <View style={styles.barOuter}>
        {isEmpty ? (
          <View style={styles.barFillEmpty} />
        ) : (
          <View style={[styles.barFillActive, { width: fillWidth }]} />
        )}

        <View style={styles.barTextWrapper}>
          <Text style={styles.barText}>{`${current}/${total}`}</Text>
        </View>
      </View>
    </View>
  );
}

const COLOR_BAR_BG = 'rgba(0,0,0,0.5)';
const COLOR_BAR_BORDER = 'rgba(255,255,255,0.4)';
const COLOR_BAR_EMPTY = 'rgba(160,160,160,0.35)';
const COLOR_BAR_ACTIVE = '#ee30d4ff';

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  overlay: {
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

  contentWrapper: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  blockWrapper: {
    alignItems: 'center',
    marginBottom: 28,
  },

  blockTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },

  blockSubtitle: {
    color: '#fff',
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: '400',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 12,
    lineHeight: 16,
  },

  barOuter: {
    width: BAR_MAX_WIDTH,
    height: 28,
    borderRadius: 6,
    backgroundColor: COLOR_BAR_BG,
    borderWidth: 1,
    borderColor: COLOR_BAR_BORDER,
    overflow: 'hidden',
    justifyContent: 'center',
  },

  barFillEmpty: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: BAR_MAX_WIDTH,
    backgroundColor: COLOR_BAR_EMPTY,
  },

  barFillActive: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: COLOR_BAR_ACTIVE,
  },

  barTextWrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  barText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
});
