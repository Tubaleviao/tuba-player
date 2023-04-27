import React, { useState, useEffect, memo } from 'react'
import { BehaviorSubject } from 'rxjs'
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators'
import { StyleSheet, FlatList, SafeAreaView, TextInput } from 'react-native'
import SongItem from "./songItem"

const SongList = ({ songList = [], play }) => {
	const [songs, setSongs] = useState(songList.map((s,i) => ({id: i, name: s})))
	let changing = new BehaviorSubject()
	let changingTreated = changing.pipe(debounceTime(300), distinctUntilChanged(), filter(v => v))

	useEffect(() => {
		let subs = changingTreated.subscribe(v => {
			setSongs([...songList.map((s,i) => ({id: i, name: s})).filter(s => s.name.toLowerCase().includes(v.toLowerCase()) )])
		})
		let subs2 = changing.subscribe(v => { if (v === '') setSongs(songList.map((s,i) => ({id: i, name: s}))) })
		return () => { subs.unsubscribe(); subs2.unsubscribe() }
	}, [changingTreated])

	useEffect(() => setSongs(songList.map((s,i) => ({id: i, name: s}))), [songList])

	let handle = v => changing.next(v)

	return (
		<SafeAreaView>
			<TextInput style={styles.input} placeholder="Search..." placeholderTextColor='#050' onChangeText={handle}></TextInput>
			<FlatList data={songs}
				initialNumToRender={7}
				renderItem={({ item }) => {
					return (<SongItem play={play} song={item} ></SongItem>)
				}
			}
				keyExtractor={song => song.id}
			/>
		</SafeAreaView>
	)
}

export default SongList

const styles = StyleSheet.create({
	title: {
		fontSize: 32,
	},
	input: {
		borderColor: '#005500',
		borderWidth: 1,
		marginBottom: 4,
		marginHorizontal: 32,
		color: '#00ff00',
	}
});