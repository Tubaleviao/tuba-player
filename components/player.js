import React, { useState, useEffect } from 'react'
import SongList from './songList'
import { SafeAreaView, View, Text, StyleSheet, TouchableHighlight, StatusBar } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Upload from './upload'
import Progress from './progress'
import AsyncStorage from '@react-native-async-storage/async-storage'
import tp, { Capability } from 'react-native-track-player'

const Player = ({ navigation, route }) => {

	const [songs, setSongs] = useState(route.params ? route.params.songs || [] : [])
	const [sliding, setSliding] = useState(false)
	const [music, setMusic] = useState('')
	const [playing, setPlaying] = useState(false)
	const [error, setError] = useState(false)

	useEffect(() => navigation.addListener('focus', async () => {
		const song = JSON.parse(await AsyncStorage.getItem('newSong'))
		if (song) {
			let u = JSON.parse(await AsyncStorage.getItem('user')).username
			if (songs.length === 0) loadSong(song[0])
			setSongs(songs => ([...songs.concat(song)]))
			tp.add(song.map(s => getTrack(u, s)))
			await AsyncStorage.removeItem('newSong')
		}
	}), [])

	const t = {
		artist: '', album: '', genre: '',
		date: '2020-06-29T07:00:00+00:00', artwork: 'https://tuba.work/img/icon.ico'
	}

	const play = tp => async () => { tp.play(); setPlaying(true) }
	const stop = tp => async () => { tp.pause(); setPlaying(false) }
	const pause = tp => async () => { tp.pause(); setPlaying(false) }
	const forward = tp => async () => tp.skipToNext().catch(inite)

	const getTrack = (u, s) => {
		const uri = `https://tuba.work/users/${u}/${s}`
		return { ...t, id: s, title: s, url: uri }
	}

	const inite = async (tp, setMusic, setPlaying) => {
		await tp.setupPlayer()
		await tp.updateOptions({
			stopWithApp: true,
			capabilities: [
				Capability.Play,
				Capability.Pause,
				Capability.SkipToNext,
				Capability.SkipToPrevious,
				Capability.Stop
			],
			compactCapabilities: [
				Capability.Play,
				Capability.Pause
			]
		})

		if (songs.length > 0) {
			let u = JSON.parse(await AsyncStorage.getItem('user')).username
			await tp.add(songs.map(s => getTrack(u, s)))
			await tp.play()
			setMusic(songs[0])
			setPlaying(true)
		}
	}

	const loadSong = tp => async songIndex => {
		await tp.skip(songIndex)
		await tp.play()
	}

	const updateSongs = async s => {
		switch (typeof s) {
			case "string": songs.push(s); break;
			case "object": s.forEach(song => songs.push(song)); break;
		}
		setMusic(songs[0])
		await inite(tp, setMusic, setPlaying)
	}

	let onTrackChange;
	let onEnded;

	useEffect(() => {
		onEnded = tp.addEventListener('playback-queue-ended', async data => {
			if (data.position !== 0 && data.track !== null) inite(tp, setMusic, setPlaying)
		})
		onTrackChange = tp.addEventListener('playback-track-changed', async data => {
			const track = await tp.getTrack(data.nextTrack);
			if (track) setMusic(track.title);
		})
		inite(tp, setMusic, setPlaying)
		return function cleanup() {
			onTrackChange.remove()
			onEnded.remove()
			console.log("destroying")
		}
	}, [])

	return (
		<SafeAreaView style={styles.app}>
			{error && <Text style={styles.error}>{error}</Text>}
			{!songs.length ? (<Upload ss={updateSongs} />) : (
				<View style={styles.container}>
					<Text style={styles.container}>{music}</Text>
					<Progress setSliding={setSliding} sliding={sliding} />
					<View style={styles.icons}>
						<View style={styles.iconContainer}>
							{playing ?
								<TouchableHighlight onPress={pause(tp)} activeOpacity={0.4}>
									<Icon style={styles.iconStyle} name="pause" size={32} color="#0f0" />
								</TouchableHighlight>
								:
								<TouchableHighlight onPress={play(tp)} activeOpacity={0.4}>
									<Icon style={styles.iconStyle} name="play" size={32} color="#0f0" />
								</TouchableHighlight>
							}
							<TouchableHighlight onPress={forward(tp)} activeOpacity={0.4}>
								<Icon style={styles.iconStyle} name="forward" size={32} color="#0f0" />
							</TouchableHighlight>
							<TouchableHighlight onPress={stop(tp)} activeOpacity={0.4}>
								<Icon style={styles.iconStyle} name="stop" size={32} color="#0f0" />
							</TouchableHighlight>
						</View>
					</View>
					<SongList songList={songs} navigation={navigation} play={loadSong(tp)} />
				</View>
			)}

		</SafeAreaView>)
}

export default Player

const styles = StyleSheet.create({
	iconStyle: {
		paddingRight: 30,
		paddingLeft: 30,
	},
	iconContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap', // removing this makes button stop working
		height: 100,
		marginBottom: 50,
		marginTop: 30,
	},
	icons: {
		flex: 1,
		marginBottom: 100,
		alignItems: 'center',
	},
	app: {
		flex: 1,
		backgroundColor: '#000000'
	},
	container: {
		textAlign: 'center',
		backgroundColor: '#000',
		color: '#00ff00',
		margin: 10,
	},
	error: {
		textAlign: 'center',
		backgroundColor: '#000000',
		color: '#550000',
		margin: 10,
	},
});
