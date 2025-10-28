import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Animated,
} from 'react-native';
import Video from 'react-native-video';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useProgressStore } from '../store/progressStore';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 20 * 2 - 12) / 2;

type AchievementItemData = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  lockedThumb: any;
  videoSrc: any;
};

type Nav = NativeStackNavigationProp<RootStackParamList, 'Achievements'>;

const ACHIEVEMENT_META = [
  {
    id: 'echo',
    title: 'Echo of the Ramparts',
    description: 'Unlock for reading your first story.',
    lockedThumb: require('../assets/achv_echo_locked.png'),
    videoSrc: require('../assets/achv_echo_video.mp4'),
  },
  {
    id: 'abbey',
    title: 'Abbey Scholar',
    description: 'Unlock for reading five location stories.',
    lockedThumb: require('../assets/achv_abbey_locked.png'),
    videoSrc: require('../assets/achv_abbey_video.mp4'),
  },
  {
    id: 'keeper',
    title: 'Keeper of Legends',
    description: 'Unlock for reading all ten royal stories.',
    lockedThumb: require('../assets/achv_keeper_locked.png'),
    videoSrc: require('../assets/achv_keeper_video.mp4'),
  },
  {
    id: 'warden',
    title: 'Warden of the Crown',
    description: 'Unlock for confirming your first visit.',
    lockedThumb: require('../assets/achv_warden_locked.png'),
    videoSrc: require('../assets/achv_warden_video.mp4'),
  },
  {
    id: 'guardian',
    title: 'Guardian of the Abbey',
    description: 'Unlock for confirming five locations.',
    lockedThumb: require('../assets/achv_guardian_locked.png'),
    videoSrc: require('../assets/achv_guardian_video.mp4'),
  },
  {
    id: 'crown',
    title: 'Crown Bearer',
    description: 'Unlock for confirming all ten royal sites.',
    lockedThumb: require('../assets/achv_crown_locked.png'),
    videoSrc: require('../assets/achv_crown_video.mp4'),
  },
] as const;

export default function AchievementsScreen() {
  const navigation = useNavigation<Nav>();
  const unlockedAchievementIdsRaw = useProgressStore(
    state => state.unlockedAchievementIds
  );
  const loadFromStorage = useProgressStore(state => state.loadFromStorage);
  const unlockedAchievementIds = Array.isArray(unlockedAchievementIdsRaw)
    ? unlockedAchievementIdsRaw
    : [];
  const [playingId, setPlayingId] = useState<string | null>(null);
  const screenFade = useRef(new Animated.Value(0)).current;
  const screenTranslate = useRef(new Animated.Value(16)).current;
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(screenFade, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(screenTranslate, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [screenFade, screenTranslate]);

  const handlePressAchievement = useCallback((item: AchievementItemData) => {
    if (!item.unlocked) return; 
    setPlayingId(prev => (prev === item.id ? null : item.id));
  }, []);

  const handleVideoEnd = useCallback(() => {
    setPlayingId(null);
  }, []);
  const dataForList: AchievementItemData[] = ACHIEVEMENT_META.map(meta => ({
    ...meta,
    unlocked: unlockedAchievementIds.includes(meta.id),
  }));

  const renderItem = ({ item }: { item: AchievementItemData }) => {
    const isPlaying = playingId === item.id;
    const isUnlocked = item.unlocked;

    return (
      <AchievementCard
        item={item}
        isPlaying={isPlaying}
        isUnlocked={isUnlocked}
        onPress={() => handlePressAchievement(item)}
        onEnd={handleVideoEnd}
      />
    );
  };

  return (
    <ImageBackground
      source={require('../assets/background_1.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <Animated.View
        style={[
          styles.animatedWrapper,
          {
            opacity: screenFade,
            transform: [{ translateY: screenTranslate }],
          },
        ]}
      >
        <View style={styles.headerBar}>
          <Text style={styles.headerTitle}>Achievements</Text>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              setPlayingId(null);
              navigation.navigate('Menu');
            }}
            activeOpacity={0.8}
          >
            <Image
              source={require('../assets/menu_burger.png')}
              style={styles.menuIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <FlatList
          data={dataForList}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={renderItem}
          extraData={[playingId, unlockedAchievementIds]}
        />
      </Animated.View>
    </ImageBackground>
  );
}

function AchievementCard({
  item,
  isPlaying,
  isUnlocked,
  onPress,
  onEnd,
}: {
  item: AchievementItemData;
  isPlaying: boolean;
  isUnlocked: boolean;
  onPress: () => void;
  onEnd: () => void;
}) {
  const cardFade = useRef(new Animated.Value(0)).current;
  const cardTranslate = useRef(new Animated.Value(12)).current;
  const videoFade = useRef(new Animated.Value(isPlaying ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardFade, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslate, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start();
  }, [cardFade, cardTranslate]);

  useEffect(() => {
    Animated.timing(videoFade, {
      toValue: isPlaying ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isPlaying, videoFade]);

  return (
    <Animated.View
      style={[
        styles.cardAnimatedWrapper,
        {
          opacity: cardFade,
          transform: [{ translateY: cardTranslate }],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.cardOuter,
          isUnlocked && isPlaying ? styles.cardOuterActive : null,
        ]}
        activeOpacity={0.9}
        onPress={onPress}
        disabled={!isUnlocked}
      >
        <View style={styles.thumbWrapper}>
          {isUnlocked ? (
            <>
              {isPlaying && (
                <Animated.View style={[styles.thumbVideo, { opacity: videoFade }]}>
                  <Video
                    key={item.id}
                    source={item.videoSrc}
                    style={styles.videoPlayer}
                    resizeMode="cover"
                    paused={false}
                    muted={false}
                    repeat={false}
                    onEnd={onEnd}
                  />
                </Animated.View>
              )}

              {!isPlaying && (
                <Image
                  source={item.lockedThumb}
                  style={styles.thumbVideo}
                  resizeMode="cover"
                />
              )}

              {!isPlaying && (
                <View style={styles.playOverlay}>
                  <Image
                    source={require('../assets/play_icon.png')}
                    style={styles.playIcon}
                    resizeMode="contain"
                  />
                </View>
              )}
            </>
          ) : (
            <View style={styles.lockedThumbWrapper}>
              <Image
                source={item.lockedThumb}
                style={styles.lockedThumbImage}
                resizeMode="cover"
              />
              <View style={styles.lockOverlay}>
                <Image
                  source={require('../assets/lock_icon.png')}
                  style={styles.lockIcon}
                  resizeMode="contain"
                />
              </View>
            </View>
          )}
        </View>

        <View style={styles.cardTextBlock}>
          <Text
            style={[
              styles.cardTitle,
              !isUnlocked ? styles.cardTitleLocked : null,
            ]}
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <Text
            style={[
              styles.cardDesc,
              !isUnlocked ? styles.cardDescLocked : null,
            ]}
            numberOfLines={3}
          >
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  overlay: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

  animatedWrapper: {
    flex: 1,
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

  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },

  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  cardAnimatedWrapper: {
    width: CARD_WIDTH,
  },

  cardOuter: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    overflow: 'hidden',
  },

  cardOuterActive: {
    borderColor: '#4da6ff',
    borderWidth: 2,
  },

  thumbWrapper: {
    width: '100%',
    height: CARD_WIDTH * 0.75,
    backgroundColor: '#222',
    position: 'relative',
  },

  thumbVideo: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },

  videoPlayer: {
    width: '100%',
    height: '100%',
  },

  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },

  playIcon: {
    width: 36,
    height: 36,
    tintColor: '#fff',
  },

  lockedThumbWrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: '#444',
  },

  lockedThumbImage: {
    width: '100%',
    height: '100%',
  },

  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  lockIcon: {
    width: 40,
    height: 40,
    tintColor: '#fff',
  },

  cardTextBlock: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },

  cardTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },

  cardTitleLocked: {
    color: '#ccc',
  },

  cardDesc: {
    color: '#fff',
    fontSize: 11,
    lineHeight: 14,
  },

  cardDescLocked: {
    color: '#ccc',
  },
});
