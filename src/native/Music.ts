import TrackPlayer, {
  Capability,
  RepeatMode,
} from 'react-native-track-player';

let isPlayerSetup = false;

async function setupPlayer() {
  if (isPlayerSetup) return;
  await TrackPlayer.setupPlayer({
    waitForBuffer: true,
  });
  await TrackPlayer.updateOptions({
    capabilities: [Capability.Play, Capability.Pause, Capability.Stop],
    compactCapabilities: [Capability.Play, Capability.Pause],
  });
  await TrackPlayer.add([
    {
      id: 'achv-bgm',
      url: require('../assets/achievements_bgm.mp3'),
      title: 'Achievements Theme',
      artist: 'Echoes OST',
    },
  ]);

  await TrackPlayer.setRepeatMode(RepeatMode.Off);
  isPlayerSetup = true;
}

async function start() {
  await setupPlayer();
  await TrackPlayer.seekTo(0);
  await TrackPlayer.play();
}

async function stop() {
  try {
    await TrackPlayer.reset();
  } catch (error) {
 
  } finally {
    isPlayerSetup = false;
  }
}

export const Music = {
  start,
  stop,
};