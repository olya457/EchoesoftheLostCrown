import React from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { FavoritePlace, useFavorites } from '../store/favoritesStore';

const { width } = Dimensions.get('window');

type Nav = NativeStackNavigationProp<RootStackParamList, 'Favorite'>;

export default function FavoriteScreen() {
  const navigation = useNavigation<Nav>();
  const { favorites, toggleFavorite } = useFavorites();

  const handleRemoveFavorite = (place: FavoritePlace) => {
    toggleFavorite(place); 
  };

  const handleReadMore = (place: FavoritePlace) => {
    navigation.navigate('PlaceDescriptionOpenedFavoriteConfirmNotTapped', {
      placeId: place.id,
    });
  };

  const handleShare = async (place: FavoritePlace) => {
    try {
      await Share.share({
        message: `${place.title} • ${place.coords}`,
      });
    } catch {
    }
  };

  return (
    <ImageBackground
      source={require('../assets/background_1.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Favorite Places</Text>

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

      {favorites.length === 0 ? (
        <View style={styles.emptyWrapper}>
          <View style={styles.emptyBubble}>
            <Text style={styles.emptyBubbleText}>
              Your crown awaits its{'\n'}first gem.
            </Text>
          </View>

          <Image
            source={require('../assets/favorite_empty_heart.png')}
            style={styles.emptyHeart}
            resizeMode="contain"
          />
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.cardOuter}>
              <View style={styles.cardInner}>
                <Image
                  source={item.img}
                  style={styles.cardImage}
                  resizeMode="cover"
                />

                <View style={styles.cardRight}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.title}
                  </Text>

                  <View style={styles.coordRow}>
                    <Text
                      style={styles.coordText}
                      numberOfLines={1}
                    >
                      {item.coords}
                    </Text>
                  </View>
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={() => handleRemoveFavorite(item)}
                      activeOpacity={0.7}
                    >
                      <Image
                        source={require('../assets/favorite_active.png')}
                        style={styles.iconImage}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.readMoreBtnWrapper}
                      onPress={() => handleReadMore(item)}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={require('../assets/red_more_bg.png')}
                        style={styles.readMoreBtnImg}
                        resizeMode="stretch"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={() => handleShare(item)}
                      activeOpacity={0.7}
                    >
                      <Image
                        source={require('../assets/share_icon.png')}
                        style={styles.iconImage}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </ImageBackground>
  );
}

const CARD_BG = 'rgba(0,0,0,0.45)';
const CARD_BORDER = 'rgba(255,255,255,0.3)';

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
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

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  cardOuter: {
    backgroundColor: CARD_BG,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    marginBottom: 16,
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

  coordRow: {
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
  },

  iconButton: {
    height: 28,
    minWidth: 28,
    paddingHorizontal: 4,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  iconImage: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },

  readMoreBtnWrapper: {
    height: 32,
    minWidth: 96,
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  readMoreBtnImg: {
    width: '100%',
    height: '100%',
  },

  emptyWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  emptyBubble: {
    minWidth: '70%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 32,
  },

  emptyBubbleText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
    textAlign: 'center',
  },

  emptyHeart: {
    width: 140,
    height: 140,
  },
});
