import tp from 'react-native-track-player'

module.exports = async function() {
    //const tp = {}
    tp.addEventListener('remote-play', () => tp.play());
    tp.addEventListener('remote-pause', () => tp.pause());
    tp.addEventListener('remote-stop', () => tp.destroy());
    tp.addEventListener('remote-next', () => tp.skipToNext());
    tp.addEventListener('remote-previous', () => tp.skipToPrevious());
}