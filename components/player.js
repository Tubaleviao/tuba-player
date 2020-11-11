import React, {useState, useEffect} from 'react'
import SongList from './songList'
import { SafeAreaView, View, Text, StyleSheet, TouchableHighlight, StatusBar } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Upload from './upload'
import Progress from './progress'
import AsyncStorage from '@react-native-async-storage/async-storage'
import tp from 'react-native-track-player'

const Player = (props) => {

	const {navigation} = props

	useEffect(() => navigation.addListener('focus', async () =>{
		const song = await AsyncStorage.getItem('newSong')
		if(song){
			let u = JSON.parse(await AsyncStorage.getItem('user')).username
			if(songs.length === 0) loadSong(song)
			songs.push(song)
			setSongs([...songs])
			tp.add([getTrack(u, song)])
			await AsyncStorage.removeItem('newSong')
		}
	}), [])

	useEffect(() => navigation.addListener('blur', async () =>{}), [])

	const [songs, setSongs] = useState(props.route.params ? props.route.params.songs || [] : []) 
	const [user, setUser] = useState(props.route.params ? props.route.params.user || 'None' : 'None')
	//const [trackPos, setTrackPos] = useState(0)
	const [sliding, setSliding] = useState(false)
	const [music, setMusic] = useState('')
	//const [maxPos, setMaxPos] = useState(0) // mounted
	const [playing, setPlaying] = useState(false)
	const [error, setError] = useState(false)
	//const [mounted, setMounted] = useState(true)
	const t = { artist: '', album: '', genre: '', 
				date: '2020-06-29T07:00:00+00:00', artwork:'https://tuba.work/img/icon.ico'}
	
	const play =  async() => { tp.play(); setPlaying(true)} // so.playAsync();
	const stop = async () => { tp.stop(); setPlaying(false)} // so.stopAsync();
	const pause = async () => {tp.pause(); setPlaying(false)} // so.pauseAsync(); 

	//const backwards = async () => tp.skipToPrevious()
	const forward = async () => tp.skipToNext().catch(inite)
	//const repeat = async () => {tp.pause()} // so.pauseAsync()
	//random = async () => this.state.so.pauseAsync()
	const setTrack = v => { tp.seekTo(v/1000); setSliding(false); setTrackPos(v)} // so.setPositionAsync(v);
	// this[name]
	const icon = name => (<TouchableHighlight onPress={name} activeOpacity={0.4}>
		<Icon style={styles.iconStyle} name={name.name} size={32} color="#00ff00" />
	</TouchableHighlight>)

	const getTrack = (u, s) => {
		//let u = JSON.parse(await AsyncStorage.getItem('user')).username
		const uri = `https://tuba.work/users/${u}/${s}`
		return { ...t, id:s, title: s, url: uri}
	}

	const inite = async () => {
		await tp.setupPlayer({})
		await tp.updateOptions({
			stopWithApp: true,
			capabilities: [
				tp.CAPABILITY_PLAY,
				tp.CAPABILITY_PAUSE,
				tp.CAPABILITY_SKIP_TO_NEXT,
				tp.CAPABILITY_SKIP_TO_PREVIOUS,
				tp.CAPABILITY_STOP
			],
			compactCapabilities: [
				tp.CAPABILITY_PLAY,
				tp.CAPABILITY_PAUSE
			]
		})
		
		if(songs.length>0){
			let u = JSON.parse(await AsyncStorage.getItem('user')).username
			await tp.add(songs.map(s => getTrack(u, s)))
			await tp.play() 
			setMusic(songs[0])
			setPlaying(true)
		}
	}

	const loadSong = async song => {
		if(song){
			console.log(song)
			await tp.skip(song)
			await tp.play()
		}
	}

	const updateSongs = async s => {
		songs.push(s)
		setMusic(songs[0])
		await inite()
	}

	let onTrackChange;
	let onEnded;
	
	useEffect(() => {
		onEnded = tp.addEventListener('playback-queue-ended', async data => {
			if(data.position !==0 && data.track !== null) inite()
		})
		onTrackChange = tp.addEventListener('playback-track-changed', async data => {    
            const track = await tp.getTrack(data.nextTrack);
            if(track != null) setMusic(track.title);
		})
		inite()
		return function cleanup(){
			onTrackChange.remove()
			onEnded.remove()
			tp.destroy()
			console.log("destroying")
		}
	}, [])

	return (
		<SafeAreaView style={styles.app}>
			<StatusBar barStyle="light-content" backgroundColor="#000000" />
			{error && <Text style={styles.error}>{error}</Text>}
			{!songs.length ? ( <Upload ss={updateSongs} /> ) : (
				<View style={styles.container}>
					<Text style={styles.container}>{music}</Text>
					<Progress ss={setSliding} s={sliding} />
					<View style={styles.icons}>
						<View style={styles.iconContainer}>
							{ playing ? 
								<TouchableHighlight onPress={pause} activeOpacity={0.4}>
									<Icon style={styles.iconStyle} name="pause" size={32} color="#00ff00" />
								</TouchableHighlight> : 
								<TouchableHighlight onPress={play} activeOpacity={0.4}>
									<Icon style={styles.iconStyle} name="play" size={32} color="#00ff00" />
								</TouchableHighlight>}
							<TouchableHighlight onPress={forward} activeOpacity={0.4}>
								<Icon style={styles.iconStyle} name="forward" size={32} color="#00ff00" />
							</TouchableHighlight>
							<TouchableHighlight onPress={stop} activeOpacity={0.4}>
							<Icon style={styles.iconStyle} name="stop" size={32} color="#00ff00" />
						</TouchableHighlight>
						 </View>
					</View>
				</View>
			)}
			<SongList songList={songs} navigation={navigation} play={loadSong}/>
		</SafeAreaView>)
}

export default Player

const styles = StyleSheet.create({
	iconStyle: {
	    paddingRight: 30,
	    paddingLeft: 30,
	  },
	iconContainer:{
		flexDirection: 'row',
		flexWrap: 'wrap', // removing this makes button stop working
	},
	icons: {
		flex:1,
		marginBottom: 50,
		alignItems: 'center',
	},
	app: {
		flex: 1,
		backgroundColor: '#000000'
	},
	container: {
		textAlign: 'center',
    	backgroundColor: '#000000',
	    color: '#00ff00',
	    margin: 10,
	},
	error: {
		textAlign: 'center',
    	backgroundColor: '#000000',
	    color: '#ff0000',
	    margin: 10,
	},
});
