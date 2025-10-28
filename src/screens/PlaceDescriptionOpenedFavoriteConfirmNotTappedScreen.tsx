import React, { useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Share,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useFavorites, FavoritePlace } from '../store/favoritesStore';
import { useConfirm } from '../store/confirmStore';
import { useProgressStore } from '../store/progressStore';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'PlaceDescriptionOpenedFavoriteConfirmNotTapped'
>;

type DetailData = {
  id: string;
  title: string;
  coords: string;
  img: any;
  description: string;
  fact: string;
};

const PLACES_DETAIL: Record<string, DetailData> = {
  '1': {
    id: '1',
    title: 'Edinburgh Castle',
    coords: '55.9486° N, 3.1999° W',
    img: require('../assets/edinburgh_castle.png'),
    description:
      "Perched atop Castle Rock, Edinburgh Castle dominates the city skyline and holds centuries of royal history. The site has been inhabited since at least the Iron Age and became a royal stronghold by the 12th century.\n\nFor generations, it was the residence of Scottish monarchs, a fortress during sieges, and a symbol of power. From the Crown Jewels to the Stone of Destiny, the castle contains Scotland’s most treasured relics.\nEach wall bears the marks of countless conflicts — from medieval wars to the Jacobite uprisings. The Great Hall, once echoing with royal banquets, now stands as a silent witness to shifting reigns.\nAt sunset, the castle’s stone glows gold against the fading light, a reminder of glory and resilience.",
    fact:
      "Interesting fact: The daily 1 o’clock gun has been fired from the castle since 1861 — originally to help ships synchronize their maritime clocks.",
  },
  '2': {
    id: '2',
    title: 'Palace of Holyroodhouse',
    coords: '55.9520° N, 3.1727° W',
    img: require('../assets/palace_holyroodhouse.png'),
    description:
      "The official residence of the British monarch in Scotland, Holyrood Palace has been the setting of royal life for more than 500 years. Its baroque façade faces the dramatic Arthur’s Seat.\n\nMary, Queen of Scots lived here in the 1560s — years marked by intrigue and tragedy. Her private chambers still tell the story of political betrayal and personal heartbreak.\nLater, Bonnie Prince Charlie made the palace his headquarters during the 1745 Jacobite Rising. His brief reign left behind relics of lost hope.\nToday, the palace remains active — used by the King for ceremonies and audiences during royal visits to Scotland.",
    fact:
      "Interesting fact: The Queen’s Gallery beside the palace exhibits priceless art from the Royal Collection — but its foundation stands on the ruins of a 12th-century abbey.",
  },
  '3': {
    id: '3',
    title: 'St Giles’ Cathedral',
    coords: '55.9495° N, 3.1908° W',
    img: require('../assets/st_giles_cathedral.png'),
    description:
      "Known as the High Kirk of Edinburgh, St Giles’ Cathedral has been a place of worship for nearly 900 years. Its crown-shaped spire symbolizes unity between Scotland’s monarchy and its faith.\n\nThe cathedral became a focal point during the Scottish Reformation. John Knox, leader of the movement, preached here fiery sermons that changed the nation’s religious landscape.\nInside, sunlight filters through stained glass, illuminating memorials to poets, warriors, and reformers.\nThe Thistle Chapel — home to the Order of the Thistle — glows with intricate carvings of angels, unicorns, and heraldic emblems.",
    fact:
      "Interesting fact: The Thistle Chapel’s ceiling hides 16 angels, each playing a different medieval musical instrument — none repeated.",
  },
  '4': {
    id: '4',
    title: 'The Royal Mile',
    coords: '55.9498° N, 3.1900° W',
    img: require('../assets/royal_mile.png'),
    description:
      "Stretching from Edinburgh Castle to Holyrood Palace, the Royal Mile is a living corridor of history. Its cobblestones have felt the footsteps of monarchs, soldiers, and merchants for centuries.\n\nAlong its route stand old tenements, courtyards, and taverns that once hosted nobles and spies alike. The Mile was where royal processions paraded — from coronations to executions.\nBeneath the street, a labyrinth of hidden closes tells darker tales of plague and superstition.\nModern Edinburgh still pulses here — musicians, storytellers, and visitors blend past and present into one timeless rhythm.",
    fact:
      "Interesting fact: The Royal Mile is not exactly a mile — it’s actually 1.12 Scottish miles (around 1.8 km).",
  },
  '5': {
    id: '5',
    title: 'Holyrood Abbey Ruins',
    coords: '55.9513° N, 3.1713° W',
    img: require('../assets/holyrood_abbey.png'),
    description:
      "Founded in 1128 by King David I, the abbey once stood as one of Scotland’s grandest monasteries. Its Gothic arches now rise like a skeleton against the sky.\n\nRoyal coronations and weddings took place here — even after the abbey fell into ruin. Mary, Queen of Scots, was crowned nearby, linking her fate to this sacred site.\nThe collapse of its roof in the 18th century turned it into a haunting relic of beauty and loss.\nToday, twilight falls through open stone windows, bathing the moss-covered floor in gold.",
    fact:
      "Interesting fact: According to legend, King David founded the abbey after a miraculous encounter with a stag carrying a glowing cross between its antlers.",
  },
  '6': {
    id: '6',
    title: 'Craigmillar Castle',
    coords: '55.9230° N, 3.1357° W',
    img: require('../assets/craigmillar_castle.png'),
    description:
      "Nestled in quiet countryside just outside the city, Craigmillar Castle is often called “Edinburgh’s other castle.”\n\nIt was a favored retreat of Mary, Queen of Scots, where she sought refuge after the murder of her secretary, David Rizzio. The thick walls whisper secrets of alliances and betrayals.\nArchitecturally, it’s one of Scotland’s best-preserved medieval castles — with spiral staircases and hidden chambers.\nFrom the towers, the view stretches to Arthur’s Seat and the North Sea — a panorama once admired by exiled monarchs.",
    fact:
      "Interesting fact: The phrase “Craigmillar Bond” refers to the alleged plan to assassinate Mary’s husband, Lord Darnley — hatched right here in 1566.",
  },
  '7': {
    id: '7',
    title: 'Calton Hill',
    coords: '55.9550° N, 3.1820° W',
    img: require('../assets/calton_hill.png'),
    description:
      "One of Edinburgh’s most iconic viewpoints, Calton Hill blends royal memory with civic pride. Its neoclassical monuments mimic Athens — earning the city its nickname “the Athens of the North.”\n\nThe Nelson Monument and the National Monument were built to honor heroes and ideals of unity.\nAt dusk, the hill becomes a canvas of colors, the skyline glowing with castle lights and the palace below.\nCalton Hill was also where royal proclamations were once read to the citizens.",
    fact:
      "Interesting fact: The unfinished National Monument was meant to replicate the Parthenon — but construction halted in 1829 due to lack of funds.",
  },
  '8': {
    id: '8',
    title: 'Canongate Kirk',
    coords: '55.9490° N, 3.1830° W',
    img: require('../assets/canongate_kirk.png'),
    description:
      "Built in 1691, Canongate Kirk serves as the parish church for Edinburgh’s Old Town — and the official royal parish.\n\nMembers of the royal family still attend services here when visiting Scotland.\nIts simple Dutch-inspired architecture contrasts with the grandeur of the nearby palace. Inside, royal pews remain reserved for the monarch’s use.\nThe churchyard is a quiet resting place for poets, philosophers, and city founders.",
    fact:
      "Interesting fact: The marriage of Zara Phillips, granddaughter of Queen Elizabeth II, took place here in 2011.",
  },
  '9': {
    id: '9',
    title: 'Lauriston Castle',
    coords: '55.9676° N, 3.2728° W',
    img: require('../assets/lauriston_castle.png'),
    description:
      "This Edwardian castle by the Firth of Forth combines romance and serenity. Built on the site of an older tower house, it offers panoramic views of the water.\n\nInside, the rooms remain frozen in time — perfectly preserved as they were in 1926.\nThe castle’s gardens blend Scottish landscape with Japanese design, symbolizing harmony between tradition and renewal.\nRoyal guests and dignitaries often stayed here on their way to the Highlands.",
    fact:
      "Interesting fact: Lauriston’s “Japanese Garden of Friendship” was created in 2002 as a gift from Kyoto — marking 40 years of cultural ties between Japan and Scotland.",
  },
  '10': {
    id: '10',
    title: 'Rosslyn Chapel',
    coords: '55.8557° N, 3.1607° W',
    img: require('../assets/rosslyn_chapel.png'),
    description:
      "Just south of Edinburgh, Rosslyn Chapel is a masterpiece of symbolism and myth. Built in the 15th century by William Sinclair, it’s covered in mysterious carvings.\n\nKnights, angels, dragons, and plants intertwine in intricate stone lace. Some believe it holds hidden connections to the Knights Templar or the Holy Grail.\nDespite centuries of speculation, the chapel remains an awe-inspiring work of devotion and mystery.\nLight streaming through the windows transforms its carvings into living art.",
    fact:
      "Interesting fact: The apprentice pillar — the chapel’s most famous column — is said to have been carved by a young mason who was murdered by his jealous master upon returning from Rome.",
  },
};

export default function PlaceDescriptionOpenedFavoriteConfirmNotTappedScreen({
  route,
  navigation,
}: Props) {
  const { placeId } = route.params || {};

  const { isFavorite, toggleFavorite } = useFavorites();
  const { confirmPlace } = useConfirm();

  const markStoryRead = useProgressStore(state => state.markStoryRead);
  const confirmLocationInProgressStore = useProgressStore(
    state => state.confirmLocation
  );
  const confirmVisitedArray = useProgressStore(
    state => state.confirmedLocationIds
  );

  const place = useMemo<DetailData>(() => {
    if (placeId && PLACES_DETAIL[placeId]) return PLACES_DETAIL[placeId];
    return PLACES_DETAIL['1'];
  }, [placeId]);

  const favoriteNow = isFavorite(place.id);

  const confirmedNow = confirmVisitedArray.includes(place.id);

  useEffect(() => {
    markStoryRead(place.id);
  }, [markStoryRead, place.id]);

  const handleToggleFavorite = () => {
    toggleFavorite({
      id: place.id,
      title: place.title,
      coords: place.coords,
      img: place.img,
    } as FavoritePlace);
  };

  const handleConfirmLocation = () => {
    confirmPlace(place.id);
    confirmLocationInProgressStore(place.id);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${place.title}\n${place.coords}\n\n${place.description}`,
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

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.topIconBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Image
            source={require('../assets/back_icon.png')}
            style={styles.topIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text style={styles.topTitle} numberOfLines={1}>
          {place.title}
        </Text>

        <TouchableOpacity
          style={styles.topIconBtn}
          onPress={() => navigation.navigate('Menu')}
          activeOpacity={0.7}
        >
          <Image
            source={require('../assets/menu_burger.png')}
            style={styles.topIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.placeCard}>
          <Image
            source={place.img}
            style={styles.placeImage}
            resizeMode="cover"
          />
          <Text style={styles.coordsText}>{place.coords}</Text>
        </View>

        <Text style={styles.descText}>{place.description}</Text>

        <View style={styles.confirmBlock}>
          {confirmedNow ? (
            <>
              <Text style={styles.confirmTitle}>
                Location confirmed! A royal secret has been unlocked.
              </Text>
              <Text style={styles.confirmBody}>{place.fact}</Text>
            </>
          ) : (
            <Text style={styles.confirmBodyCenter}>
              We couldn’t verify your visit this time — try once more.
            </Text>
          )}
        </View>

        <View style={styles.bottomActionsRow}>
          <TouchableOpacity
            style={styles.bottomActionBtn}
            activeOpacity={0.7}
            onPress={handleToggleFavorite}
          >
            <Image
              source={
                favoriteNow
                  ? require('../assets/favorite_active.png')
                  : require('../assets/favorite_inactive.png')
              }
              style={styles.bottomIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {!confirmedNow && (
            <TouchableOpacity
              style={styles.confirmBtnWrapper}
              activeOpacity={0.8}
              onPress={handleConfirmLocation}
            >
              <Image
                source={require('../assets/confirm_location_btn.png')}
                style={styles.confirmBtnImage}
                resizeMode="stretch"
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.bottomActionBtn}
            activeOpacity={0.7}
            onPress={handleShare}
          >
            <Image
              source={require('../assets/share_icon.png')}
              style={styles.bottomIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.factText}>{place.fact}</Text>

        <View style={styles.bottomSpacer} />
      </ScrollView>
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  topBar: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: 'rgba(10,12,16,0.7)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  topTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  placeCard: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  placeImage: {
    width: '100%',
    height: 140,
    borderRadius: 6,
    backgroundColor: '#333',
    marginBottom: 8,
  },
  coordsText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '400',
    opacity: 0.9,
    textAlign: 'center',
  },
  descText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '400',
    marginBottom: 24,
  },
  confirmBlock: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    padding: 16,
    marginBottom: 24,
  },
  confirmTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  confirmBody: {
    color: '#fff',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  },
  confirmBodyCenter: {
    color: '#fff',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  bottomActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 16,
    paddingVertical: 12,

    marginBottom: 16,
  },
  bottomActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  confirmBtnWrapper: {
    flex: 1,
    marginHorizontal: 12,
    height: 28,
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  confirmBtnImage: {
    width: '100%',
    height: '100%',
  },
  factText: {
    color: '#fff',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 24,
  },
  bottomSpacer: {
    height: 48,
  },
});
