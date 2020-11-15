import React, {useState, useEffect} from 'react'
import { BehaviorSubject} from 'rxjs'
import {debounceTime, distinctUntilChanged, filter} from 'rxjs/operators'
import {StyleSheet, FlatList, SafeAreaView, Text, TouchableHighlight, TextInput} from 'react-native'

const SongList = ({navigation, songList=[], play}) => {
	const [songs, setSongs] = useState(songList)
	let changing = new BehaviorSubject('')
	let changingTreated = changing.pipe(debounceTime(500), distinctUntilChanged(), filter(val => val.length>0))

	useEffect(() => {
		let subs = changingTreated.subscribe(v => {
			setSongs(songList.filter(s => s.toLowerCase().includes(v.toLowerCase())))
		})
		return () => subs.unsubscribe()
	}, [changingTreated, setSongs])

	let handle = v => changing.next(v)

	let counter=0
	return (
		<SafeAreaView>
			<TextInput style={styles.input} placeholder="Search..." placeholderTextColor='#050' onChangeText={handle}></TextInput>
			<FlatList data={songs}
				renderItem={({item}) => (
					<TouchableHighlight 
						onPress={() => play(item.substr(item.lastIndexOf('/')+1))} >
						<Text style={styles.item}>{item}</Text>
					</TouchableHighlight>)}
				keyExtractor={item => String(++counter)}
			/>
		</SafeAreaView>
	)
}

export default SongList

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
  },
  item: {
  	color: '#00ff00',
    backgroundColor: '#002200',
    padding: 16,
    marginVertical: 4,
	marginHorizontal: 16,
	textAlign: "center",
  },
  input: {
	  borderColor: '#005500',
	  borderWidth: 1,
	  marginBottom: 4,
	  marginHorizontal: 32,
	  color: '#00ff00',
  }
});