import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@trackingStats';

export type ProgressState = {
  storiesTotal: number;
  storiesReadIds: string[];
  locationsTotal: number;
  confirmedLocationIds: string[];
  totalAchievements: number;
  unlockedAchievementIds: string[];

  markStoryRead: (storyId: string) => void;
  confirmLocation: (locId: string) => void;
  unlockAchievement: (achId: string) => void;

  loadFromStorage: () => Promise<void>;

  resetAll: () => Promise<void>;
};
async function persistStateForStorage(stateLike: {
  storiesTotal: number;
  storiesReadIds: string[];

  locationsTotal: number;
  confirmedLocationIds: string[];

  totalAchievements: number;
  unlockedAchievementIds: string[];
}) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stateLike));
  } catch (e) {
    console.warn('persistStateForStorage failed', e);
  }
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  storiesTotal: 10,
  storiesReadIds: ['story1', 'story2', 'story3', 'story4', 'story5'],

  locationsTotal: 10,
  confirmedLocationIds: ['1', '2', '3', '4', '5'],

  totalAchievements: 6,
  unlockedAchievementIds: ['echo', 'abbey', 'keeper'],
  markStoryRead: (storyId: string) => {
    const { storiesReadIds } = get();
    if (storiesReadIds.includes(storyId)) return;

    const nextStoriesRead = [...storiesReadIds, storyId];

    set(state => {
      const next = {
        ...state,
        storiesReadIds: nextStoriesRead,
      };
      persistStateForStorage({
        storiesTotal: next.storiesTotal,
        storiesReadIds: next.storiesReadIds,

        locationsTotal: next.locationsTotal,
        confirmedLocationIds: next.confirmedLocationIds,

        totalAchievements: next.totalAchievements,
        unlockedAchievementIds: next.unlockedAchievementIds,
      });

      return next;
    });
  },
  confirmLocation: (locId: string) => {
    const { confirmedLocationIds } = get();
    if (confirmedLocationIds.includes(locId)) return;

    const nextConfirmed = [...confirmedLocationIds, locId];

    set(state => {
      const next = {
        ...state,
        confirmedLocationIds: nextConfirmed,
      };

      persistStateForStorage({
        storiesTotal: next.storiesTotal,
        storiesReadIds: next.storiesReadIds,

        locationsTotal: next.locationsTotal,
        confirmedLocationIds: next.confirmedLocationIds,

        totalAchievements: next.totalAchievements,
        unlockedAchievementIds: next.unlockedAchievementIds,
      });

      return next;
    });
  },
  unlockAchievement: (achId: string) => {
    const { unlockedAchievementIds } = get();
    if (unlockedAchievementIds.includes(achId)) return;

    const nextUnlocked = [...unlockedAchievementIds, achId];

    set(state => {
      const next = {
        ...state,
        unlockedAchievementIds: nextUnlocked,
      };

      persistStateForStorage({
        storiesTotal: next.storiesTotal,
        storiesReadIds: next.storiesReadIds,

        locationsTotal: next.locationsTotal,
        confirmedLocationIds: next.confirmedLocationIds,

        totalAchievements: next.totalAchievements,
        unlockedAchievementIds: next.unlockedAchievementIds,
      });

      return next;
    });
  },

  loadFromStorage: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return; 

      const parsed = JSON.parse(raw);
      set(state => ({
        ...state,

        storiesTotal:
          typeof parsed.storiesTotal === 'number'
            ? parsed.storiesTotal
            : state.storiesTotal,

        storiesReadIds:
          Array.isArray(parsed.storiesReadIds)
            ? parsed.storiesReadIds
            : state.storiesReadIds,

        locationsTotal:
          typeof parsed.locationsTotal === 'number'
            ? parsed.locationsTotal
            : state.locationsTotal,

        confirmedLocationIds:
          Array.isArray(parsed.confirmedLocationIds)
            ? parsed.confirmedLocationIds
            : state.confirmedLocationIds,

        totalAchievements:
          typeof parsed.totalAchievements === 'number'
            ? parsed.totalAchievements
            : state.totalAchievements,

        unlockedAchievementIds:
          Array.isArray(parsed.unlockedAchievementIds)
            ? parsed.unlockedAchievementIds
            : state.unlockedAchievementIds,
      }));
    } catch (e) {
      console.warn('loadFromStorage failed', e);
    }
  },
  resetAll: async () => {
    const {
      storiesTotal,
      locationsTotal,
      totalAchievements,
    } = get();

    const cleared = {
      storiesTotal,
      storiesReadIds: [],

      locationsTotal,
      confirmedLocationIds: [],

      totalAchievements,
      unlockedAchievementIds: [],
    };
    set(state => ({
      ...state,
      ...cleared,
    }));
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cleared));
    } catch (e) {
      console.warn('resetAll persist failed', e);
    }
  },
}));
