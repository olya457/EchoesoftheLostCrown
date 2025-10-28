import TrackPlayer, {
  Capability,
  RepeatMode,
  State,
} from 'react-native-track-player';

let isPlayerSetup = false;

async function setupPlayerOnce() {
  if (isPlayerSetup) return;

  await TrackPlayer.setupPlayer({
    waitForBuffer: true,
  });

  await TrackPlayer.updateOptions({
    capabilities: [Capability.Play, Capability.Pause, Capability.Stop],
    compactCapabilities: [Capability.Play, Capability.Pause],
  });

  await TrackPlayer.reset();

  await TrackPlayer.add([
    {
      id: 'achv-bgm',
      url: require('../assets/achievements_bgm.mp3'),
      title: 'Achievements Theme',
      artist: 'Echoes OST',
    },
  ]);

  await TrackPlayer.setRepeatMode(RepeatMode.Track);

  isPlayerSetup = true;
}

async function start() {
  await setupPlayerOnce();

  const currentState = await TrackPlayer.getState();

  if (currentState === State.Playing) {
    return;
  }

  await TrackPlayer.seekTo(0);
  await TrackPlayer.play();
}

async function stop() {
  try {
    await TrackPlayer.pause();
    await TrackPlayer.stop();
  } catch (e) {

  }
  
}

export const Music = {
  start,
  stop,
};
