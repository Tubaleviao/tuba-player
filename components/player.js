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

	const [songs, setSongs] = useState(props.route.params ? props.route.params.songs || [] : [])
	const [sliding, setSliding] = useState(false)
	const [music, setMusic] = useState('')
	const [playing, setPlaying] = useState(false)
	const [error, setError] = useState(false)

	useEffect(() => navigation.addListener('focus', async () =>{
		const song = JSON.parse(await AsyncStorage.getItem('newSong'))
		if(song){
			let u = JSON.parse(await AsyncStorage.getItem('user')).username
			if(songs.length === 0) loadSong(song[0])
			setSongs(songs => ([...songs.concat(song)]))
			tp.add(song.map( s => getTrack(u, s)))
			await AsyncStorage.removeItem('newSong')
		}
	}), [])

	useEffect(() => navigation.addListener('blur', async () =>{}), [])

	const t = { artist: '', album: '', genre: '', 
				date: '2020-06-29T07:00:00+00:00', artwork:'https://tuba.work/img/icon.ico'}
	
	const play =  async() => { tp.play(); setPlaying(true)} 
	const stop = async () => { tp.stop(); setPlaying(false)} 
	const pause = async () => {tp.pause(); setPlaying(false)}

	const forward = async () => tp.skipToNext().catch(inite)
	const icon = name => (<TouchableHighlight onPress={name} activeOpacity={0.4}>
		<Icon style={styles.iconStyle} name={name.name} size={32} color="#00ff00" />
	</TouchableHighlight>)

	const getTrack = (u, s) => {
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
		switch(typeof s){
			case "string": songs.push(s); break;
			case "object": s.forEach( song => songs.push(song)); break;
		}
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
					<SongList songList={songs} navigation={navigation} play={loadSong}/>
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
	    color: '#550000',
	    margin: 10,
	},
});
