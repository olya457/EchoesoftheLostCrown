import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Share,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { FavoritePlace, useFavorites } from '../store/favoritesStore';

type Nav = NativeStackNavigationProp<RootStackParamList, 'LocationsList'>;

const { width } = Dimensions.get('window');

type Place = {
  id: string;
  title: string;
  coords: string;
  img: any;
};

const PLACES: Place[] = [
  {
    id: '1',
    title: 'Edinburgh Castle',
    coords: '55.9486° N, 3.1999° W',
    img: require('../assets/edinburgh_castle.png'),
  },
  {
    id: '2',
    title: 'Palace of Holyroodhouse',
    coords: '55.9520° N, 3.1727° W',
    img: require('../assets/palace_holyroodhouse.png'),
  },
  {
    id: '3',
    title: 'St Giles’ Cathedral',
    coords: '55.9495° N, 3.1908° W',
    img: require('../assets/st_giles_cathedral.png'),
  },
  {
    id: '4',
    title: 'The Royal Mile',
    coords: '55.9498° N, 3.1900° W',
    img: require('../assets/royal_mile.png'),
  },
  {
    id: '5',
    title: 'Holyrood Abbey Ruins',
    coords: '55.9513° N, 3.1713° W',
    img: require('../assets/holyrood_abbey.png'),
  },
  {
    id: '6',
    title: 'Craigmillar Castle',
    coords: '55.9230° N, 3.1357° W',
    img: require('../assets/craigmillar_castle.png'),
  },
  {
    id: '7',
    title: 'Calton Hill',
    coords: '55.9550° N, 3.1820° W',
    img: require('../assets/calton_hill.png'),
  },
  {
    id: '8',
    title: 'Canongate Kirk',
    coords: '55.9490° N, 3.1830° W',
    img: require('../assets/canongate_kirk.png'),
  },
  {
    id: '9',
    title: 'Lauriston Castle',
    coords: '55.9676° N, 3.2728° W',
    img: require('../assets/lauriston_castle.png'),
  },
  {
    id: '10',
    title: 'Rosslyn Chapel',
    coords: '55.8557° N, 3.1607° W',
    img: require('../assets/rosslyn_chapel.png'),
  },
];

export default function LocationsListScreen() {
  const navigation = useNavigation<Nav>();
  const { isFavorite, toggleFavorite } = useFavorites();

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

  const handleToggleFavorite = (place: Place) => {
    toggleFavorite({
      id: place.id,
      title: place.title,
      coords: place.coords,
      img: place.img,
    } as FavoritePlace);
  };

  const handleShare = async (place: Place) => {
    try {
      await Share.share({
        message: `${place.title} • ${place.coords}`,
      });
    } catch {}
  };

  return (
    <ImageBackground
      source={require('../assets/background_1.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>List of Places</Text>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
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

      <Animated.View
        style={[
          styles.animatedWrapper,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateAnim }],
          },
        ]}
      >
        <FlatList
          contentContainerStyle={styles.listContent}
          data={PLACES}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <PlaceCard
              place={item}
              favorite={isFavorite(item.id)}
              onFavoritePress={() => handleToggleFavorite(item)}
              onReadMorePress={() =>
                navigation.navigate(
                  'PlaceDescriptionOpenedFavoriteConfirmNotTapped',
                  { placeId: item.id }
                )
              }
              onSharePress={() => handleShare(item)}
            />
          )}
        />
      </Animated.View>
    </ImageBackground>
  );
}

function PlaceCard({
  place,
  favorite,
  onFavoritePress,
  onReadMorePress,
  onSharePress,
}: {
  place: Place;
  favorite: boolean;
  onFavoritePress: () => void;
  onReadMorePress: () => void;
  onSharePress: () => void;
}) {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardInner}>
        <Image source={place.img} style={styles.cardImage} resizeMode="cover" />

        <View style={styles.cardRight}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {place.title}
          </Text>

          <View style={styles.rowCoords}>
            <Text style={styles.coordText} numberOfLines={1}>
              {place.coords}
            </Text>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.iconButtonClear}
              onPress={onFavoritePress}
              activeOpacity={0.7}
            >
              <Image
                source={
                  favorite
                    ? require('../assets/favorite_active.png')
                    : require('../assets/favorite_inactive.png')
                }
                style={styles.actionIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onReadMorePress}
              activeOpacity={0.8}
              style={styles.readMoreTouchableImage}
            >
              <Image
                source={require('../assets/red_more_bg.png')}
                style={styles.readMoreImage}
                resizeMode="stretch"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButtonClear}
              onPress={onSharePress}
              activeOpacity={0.7}
            >
              <Image
                source={require('../assets/share_icon.png')}
                style={styles.actionIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const CARD_BG = 'rgba(0,0,0,0.4)';
const CARD_BORDER = 'rgba(255,255,255,0.25)';

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  headerBar: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
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
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  cardContainer: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    overflow: 'hidden',
  },
  cardInner: {
    flexDirection: 'row',
    padding: 12,
  },
  cardImage: {
    width: width * 0.28,
    height: width * 0.18,
    borderRadius: 6,
    backgroundColor: '#444',
    marginRight: 12,
  },
  cardRight: {
    flex: 1,
    flexShrink: 1,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  rowCoords: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  coordText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '400',
    opacity: 0.9,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  iconButtonClear: {
    height: 28,
    minWidth: 28,
    paddingHorizontal: 4,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  actionIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  readMoreTouchableImage: {
    height: 32,
    minWidth: 96,
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  readMoreImage: {
    width: '100%',
    height: '100%',
  },
});
