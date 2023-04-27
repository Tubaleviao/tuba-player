import tp from 'react-native-track-player'

module.exports = async function() {
    tp.addEventListener('remote-play', () => tp.play())
    tp.addEventListener('remote-pause', () => tp.pause())
    tp.addEventListener('remote-next', async () => {
        const [m] = await tp.getQueue()
        tp.skipToNext().catch(e => tp.skip(m.id))
    })
    tp.addEventListener('remote-previous', () => {
        tp.skipToPrevious().catch(console.log)
    })
    tp.addEventListener('remote-stop', () => tp.destroy());
}
