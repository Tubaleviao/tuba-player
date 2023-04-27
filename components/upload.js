import React from 'react'
import { SafeAreaView, Button, StyleSheet, Text, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Api from './api'
import DocumentPicker from 'react-native-document-picker'
import RNFS from 'react-native-fs';

class Upload extends React.Component {

	constructor(props) {
		super(props)
	}

	state = { error: false, loading: false }

	// select multiple files
	pickSongs = async () => {
		this.setState({ loading: true })
		let files = []
		try {
			const res = await DocumentPicker.pickMultiple({
				type: [DocumentPicker.types.audio],
			})
			files = await Promise.all(res.map(async f => {
				let tmpPath = `${RNFS.DocumentDirectoryPath}/${f.name}`
				let fullFile = await RNFS.readFile(f.uri, 'base64')
				await RNFS.writeFile(tmpPath, fullFile, 'base64')
				return {
					name: f.name,
					filename: f.name,
					filepath: tmpPath,
					filetype: f.type
				}
			}))
		} catch (err) {
			console.log(err)
			this.setState({ loading: false, error: "Error, please try again" })
		}
		files = files.filter(f => f.filetype)
		const worked = await Api.sendAudio(files)
		if (worked.ok) {
			const { ss } = this.props
			this.setState({ loading: false })
			if (ss) ss(worked.song)
			else {
				await AsyncStorage.setItem('newSong', typeof worked.song === "string" ? JSON.stringify([worked.song]) : JSON.stringify(worked.song))
				this.props.navigation.goBack()
			}
		} else { this.setState({ error: worked.msg, loading: false }) }
	}

	render() {
		const { error, loading } = this.state
		return (
			<SafeAreaView style={styles.app}>
				{error && <Text style={styles.error}>{error}</Text>}
				<Text style={styles.container}> Try adding new songs!{"\n"} </Text>
				<Button title="Upload File" onPress={this.pickSongs} />
				{loading ? <ActivityIndicator size="large" color="#00ff00" /> : <Text></Text>}
			</SafeAreaView>
		)
	}
}

export default Upload

const styles = StyleSheet.create({
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
		color: '#f55',
		margin: 10,
	},
})
