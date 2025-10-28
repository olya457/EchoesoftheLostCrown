import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { Music } from '../audio/musicPlayer';

type MusicContextValue = {
  musicEnabled: boolean;
  setMusicEnabled: (on: boolean) => void;
};

const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [musicEnabled, setMusicEnabledState] = useState(true);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const handleEnableMusic = useCallback(async () => {
    setMusicEnabledState(true);
    if (appStateRef.current === 'active') {
      await Music.start();
    }
  }, []);

  const handleDisableMusic = useCallback(async () => {
    setMusicEnabledState(false);
    await Music.stop();
  }, []);

  const setMusicEnabled = useCallback(
    (on: boolean) => {
      if (on) {
        handleEnableMusic();
      } else {
        handleDisableMusic();
      }
    },
    [handleEnableMusic, handleDisableMusic]
  );

  useEffect(() => {
    if (musicEnabled && appStateRef.current === 'active') {
      Music.start();
    } else {
      Music.stop();
    }
  }, [musicEnabled]);

  useEffect(() => {
    function onAppStateChange(next: AppStateStatus) {
      const prev = appStateRef.current;
      appStateRef.current = next;

      if (next !== 'active') {
        Music.stop();
        return;
      }

      if (next === 'active' && prev !== 'active') {
        if (musicEnabled) {
          Music.start();
        }
      }
    }

    const sub = AppState.addEventListener('change', onAppStateChange);
    return () => {
      sub.remove();
    };
  }, [musicEnabled]);

  return (
    <MusicContext.Provider
      value={{
        musicEnabled,
        setMusicEnabled,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) {
    throw new Error('useMusic must be used inside <MusicProvider>');
  }
  return ctx;
}
