import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type FavoritePlace = {
  id: string;
  title: string;
  coords: string;
  img: any;
};

type FavoritesContextValue = {
  favorites: FavoritePlace[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (place: FavoritePlace) => Promise<void>;
  reloadFavorites: () => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined
);

const STORAGE_KEY = 'FAVORITES_V1';

async function loadFavoritesFromStorage(): Promise<FavoritePlace[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

async function saveFavoritesToStorage(favs: FavoritePlace[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
  } catch {
  }
}

export function FavoritesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [favorites, setFavorites] = useState<FavoritePlace[]>([]);

  useEffect(() => {
    (async () => {
      const data = await loadFavoritesFromStorage();
      setFavorites(data);
    })();
  }, []);

  const reloadFavorites = useCallback(async () => {
    const data = await loadFavoritesFromStorage();
    setFavorites(data);
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.some(p => p.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback(async (place: FavoritePlace) => {
    setFavorites(prev => {
      const exists = prev.find(p => p.id === place.id);
      let next: FavoritePlace[];
      if (exists) {
        next = prev.filter(p => p.id !== place.id);
      } else {
        next = [...prev, place];
      }
      saveFavoritesToStorage(next);
      return next;
    });
  }, []);

  const value: FavoritesContextValue = {
    favorites,
    isFavorite,
    toggleFavorite,
    reloadFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error(
      'useFavorites must be used inside <FavoritesProvider> (wrap App)'
    );
  }
  return ctx;
}
