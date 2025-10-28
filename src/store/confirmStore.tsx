import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'confirmed_places_v1';

type ConfirmContextValue = {
  isConfirmed: (id: string) => boolean;
  confirmPlace: (id: string) => void;
};

const ConfirmContext = createContext<ConfirmContextValue | undefined>(undefined);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [confirmedIds, setConfirmedIds] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setConfirmedIds(parsed);
          }
        }
      } catch {
      }
    })();
  }, []);

  const persist = useCallback(async (next: string[]) => {
    setConfirmedIds(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {

    }
  }, []);

  const isConfirmed = useCallback(
    (id: string) => confirmedIds.includes(id),
    [confirmedIds]
  );

  const confirmPlace = useCallback(
    (id: string) => {
      if (confirmedIds.includes(id)) return;
      const next = [...confirmedIds, id];
      persist(next);
    },
    [confirmedIds, persist]
  );

  const value: ConfirmContextValue = {
    isConfirmed,
    confirmPlace,
  };

  return <ConfirmContext.Provider value={value}>{children}</ConfirmContext.Provider>;
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error('useConfirm must be used inside <ConfirmProvider>');
  }
  return ctx;
}
