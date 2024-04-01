import TrackPlayer from 'react-native-track-player';

module.exports = async function () {
    TrackPlayer.addEventListener('remote-play', async () => await TrackPlayer.play());

    TrackPlayer.addEventListener('remote-pause', async () => await TrackPlayer.pause());

    TrackPlayer.addEventListener('remote-stop', async () => await TrackPlayer.stop());

    TrackPlayer.addEventListener('remote-jump-backward', async () => { TrackPlayer.seekTo(await TrackPlayer.getPosition() - 15); });

    TrackPlayer.addEventListener('remote-jump-forward', async () => { TrackPlayer.seekTo(await TrackPlayer.getPosition() + 15); });

    TrackPlayer.addEventListener('remote-next', async () => await TrackPlayer.skipToNext());

    TrackPlayer.addEventListener('remote-previous', async () => await TrackPlayer.skipToPrevious());
}