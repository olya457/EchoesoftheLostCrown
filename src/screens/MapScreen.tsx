import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Share,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  Region,
  LatLng,
} from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useFavorites, FavoritePlace } from '../store/favoritesStore';

const { width, height } = Dimensions.get('window');

type PlaceOnMap = {
  id: string;
  title: string;
  coordsText: string;
  latitude: number;
  longitude: number;
  img: any;
};

const PLACES: PlaceOnMap[] = [
  {
    id: '1',
    title: 'Edinburgh Castle',
    coordsText: '55.9486° N, 3.1999° W',
    latitude: 55.9486,
    longitude: -3.1999,
    img: require('../assets/edinburgh_castle.png'),
  },
  {
    id: '2',
    title: 'Palace of Holyroodhouse',
    coordsText: '55.9520° N, 3.1727° W',
    latitude: 55.9520,
    longitude: -3.1727,
    img: require('../assets/palace_holyroodhouse.png'),
  },
  {
    id: '3',
    title: 'St Giles’ Cathedral',
    coordsText: '55.9495° N, 3.1908° W',
    latitude: 55.9495,
    longitude: -3.1908,
    img: require('../assets/st_giles_cathedral.png'),
  },
  {
    id: '4',
    title: 'The Royal Mile',
    coordsText: '55.9498° N, 3.1900° W',
    latitude: 55.9498,
    longitude: -3.1900,
    img: require('../assets/royal_mile.png'),
  },
  {
    id: '5',
    title: 'Holyrood Abbey Ruins',
    coordsText: '55.9513° N, 3.1713° W',
    latitude: 55.9513,
    longitude: -3.1713,
    img: require('../assets/holyrood_abbey.png'),
  },
  {
    id: '6',
    title: 'Craigmillar Castle',
    coordsText: '55.9230° N, 3.1357° W',
    latitude: 55.9230,
    longitude: -3.1357,
    img: require('../assets/craigmillar_castle.png'),
  },
  {
    id: '7',
    title: 'Calton Hill',
    coordsText: '55.9550° N, 3.1820° W',
    latitude: 55.9550,
    longitude: -3.1820,
    img: require('../assets/calton_hill.png'),
  },
  {
    id: '8',
    title: 'Canongate Kirk',
    coordsText: '55.9490° N, 3.1830° W',
    latitude: 55.9490,
    longitude: -3.1830,
    img: require('../assets/canongate_kirk.png'),
  },
  {
    id: '9',
    title: 'Lauriston Castle',
    coordsText: '55.9676° N, 3.2728° W',
    latitude: 55.9676,
    longitude: -3.2728,
    img: require('../assets/lauriston_castle.png'),
  },
  {
    id: '10',
    title: 'Rosslyn Chapel',
    coordsText: '55.8557° N, 3.1607° W',
    latitude: 55.8557,
    longitude: -3.1607,
    img: require('../assets/rosslyn_chapel.png'),
  },
];

const START_REGION: Region = {
  latitude: 55.9495,
  longitude: -3.19,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

type Nav = NativeStackNavigationProp<RootStackParamList, 'Map'>;

export default function MapScreen() {
  const navigation = useNavigation<Nav>();
  const { isFavorite, toggleFavorite } = useFavorites();

  const mapRef = useRef<MapView | null>(null);

  const [currentRegion, setCurrentRegion] = useState<Region>(START_REGION);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedPlace = useMemo(
    () => PLACES.find(p => p.id === selectedId) || null,
    [selectedId]
  );

  const allCoords: LatLng[] = useMemo(
    () =>
      PLACES.map(p => ({
        latitude: p.latitude,
        longitude: p.longitude,
      })),
    []
  );

  const fitAllMarkers = useCallback(
    (animated: boolean = false) => {
      if (!mapRef.current || allCoords.length === 0) return;
      mapRef.current.fitToCoordinates(allCoords, {
        edgePadding: {
          top: 80,
          right: 40,
          bottom: 200,
          left: 40,
        },
        animated,
      });
    },
    [allCoords]
  );

  useEffect(() => {
    const t = setTimeout(() => {
      fitAllMarkers(false);
    }, 300);
    return () => clearTimeout(t);
  }, [fitAllMarkers]);

  const handleRegionChangeComplete = (region: Region) => {
    setCurrentRegion(region);
  };

  const handleMarkerPress = (place: PlaceOnMap) => {
    setSelectedId(place.id);

    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: place.latitude,
          longitude: place.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        300
      );
    }
  };

  const handleMapPress = () => {
    setSelectedId(null);
  };

  const handleShare = async (place: PlaceOnMap) => {
    try {
      await Share.share({
        message: `${place.title} • ${place.coordsText}`,
      });
    } catch {}
  };

  const handleToggleFavorite = (place: PlaceOnMap) => {
    toggleFavorite({
      id: place.id,
      title: place.title,
      coords: place.coordsText,
      img: place.img,
    } as FavoritePlace);
  };

  const handleReadMore = (place: PlaceOnMap) => {
    navigation.navigate('PlaceDescriptionOpenedFavoriteConfirmNotTapped', {
      placeId: place.id,
    });
  };

  const zoomIn = () => {
    if (!mapRef.current) return;
    const newRegion: Region = {
      ...currentRegion,
      latitudeDelta: currentRegion.latitudeDelta * 0.5,
      longitudeDelta: currentRegion.longitudeDelta * 0.5,
    };
    mapRef.current.animateToRegion(newRegion, 200);
  };

  const zoomOut = () => {
    if (!mapRef.current) return;
    const newRegion: Region = {
      ...currentRegion,
      latitudeDelta: currentRegion.latitudeDelta * 2,
      longitudeDelta: currentRegion.longitudeDelta * 2,
    };
    mapRef.current.animateToRegion(newRegion, 200);
  };

  const resetZoom = () => {
    setSelectedId(null);
    fitAllMarkers(true);
  };

  return (
    <View style={styles.root}>
      <TouchableWithoutFeedback onPress={handleMapPress}>
        <View style={StyleSheet.absoluteFill}>
          <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFill}
            provider={PROVIDER_GOOGLE}
            region={currentRegion}
            customMapStyle={darkMapStyle}
            onRegionChangeComplete={handleRegionChangeComplete}
            scrollEnabled
            zoomEnabled
            rotateEnabled={false}
            pitchEnabled={false}
          >
            {PLACES.map(place => (
              <Marker
                key={place.id}
                coordinate={{
                  latitude: place.latitude,
                  longitude: place.longitude,
                }}
                onPress={e => {
                  e.stopPropagation?.();
                  handleMarkerPress(place);
                }}
              >
                <Image
                  source={require('../assets/pin_icon.png')}
                  style={styles.pinIcon}
                  resizeMode="contain"
                />
              </Marker>
            ))}
          </MapView>
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Map</Text>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate('Menu')}
          activeOpacity={0.8}
        >
          <Image
            source={require('../assets/menu_burger.png')}
            style={styles.menuIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      {selectedPlace && (
        <View
          style={[
            styles.placeCardWrapper,
            isFavorite(selectedPlace.id) ? styles.placeCardWrapperActive : null,
          ]}
        >
          <View style={styles.placeCardInner}>
            <Image
              source={selectedPlace.img}
              style={styles.placeImage}
              resizeMode="cover"
            />

            <View style={styles.placeInfoBlock}>
              <Text style={styles.placeTitle} numberOfLines={1}>
                {selectedPlace.title}
              </Text>

              <Text style={styles.placeCoords} numberOfLines={1}>
                {selectedPlace.coordsText}
              </Text>

              <View style={styles.rowButtons}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.readMoreBtnWrapper}
                  onPress={() => handleReadMore(selectedPlace)}
                >
                  <Image
                    source={require('../assets/red_more_bg.png')}
                    style={styles.readMoreBtnImg}
                    resizeMode="stretch"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.iconButton}
                  onPress={() => handleToggleFavorite(selectedPlace)}
                >
                  <Image
                    source={
                      isFavorite(selectedPlace.id)
                        ? require('../assets/favorite_active.png')
                        : require('../assets/favorite_inactive.png')
                    }
                    style={styles.iconImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.iconButton}
                  onPress={() => handleShare(selectedPlace)}
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

      <View style={styles.zoomControlsWrapper}>
        <TouchableOpacity
          style={styles.zoomBtn}
          onPress={zoomIn}
          activeOpacity={0.8}
        >
          <Text style={styles.zoomBtnText}>＋</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.zoomBtn}
          onPress={zoomOut}
          activeOpacity={0.8}
        >
          <Text style={styles.zoomBtnText}>－</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.zoomBtn, styles.resetBtn]}
          onPress={resetZoom}
          activeOpacity={0.8}
        >
          <Text style={styles.zoomBtnText}>↺</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#0d0f12' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#ffffff' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#000000' }] },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#2a2d31' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#4a4d52' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#090a0d' }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#1a1d22' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    stylers: [{ visibility: 'off' }],
  },
];

const CARD_BG = 'rgba(0,0,0,0.65)';
const CARD_BORDER = 'rgba(255,255,255,0.4)';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },

  pinIcon: {
    width: 32,
    height: 32,
  },

  headerBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 40,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    paddingBottom: 10,
    paddingTop: 10,
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  menuIcon: {
    width: 18,
    height: 18,
    tintColor: '#fff',
  },

  placeCardWrapper: {
    position: 'absolute',
    top: 110,
    left: 16,
    right: 16,
    backgroundColor: CARD_BG,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: 10,
  },

  placeCardWrapperActive: {
    borderColor: '#4da6ff',
    borderWidth: 2,
  },

  placeCardInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  placeImage: {
    width: width * 0.28,
    height: width * 0.18,
    borderRadius: 6,
    backgroundColor: '#444',
    marginRight: 12,
  },

  placeInfoBlock: {
    flex: 1,
    flexShrink: 1,
  },

  placeTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },

  placeCoords: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '400',
    opacity: 0.9,
    marginBottom: 8,
  },

  rowButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },

  readMoreBtnWrapper: {
    height: 28,
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

  zoomControlsWrapper: {
    position: 'absolute',
    right: 16,
    bottom: 32,
    alignItems: 'center',
  },

  zoomBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  resetBtn: {
    backgroundColor: 'rgba(30,30,30,0.8)',
  },

  zoomBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
