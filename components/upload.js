import React from 'react'
import { SafeAreaView, Button, StyleSheet, Text, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Api from './api'
import DocumentPicker from 'react-native-document-picker'
import RNFS from 'react-native-fs';

class Upload extends React.Component{

	constructor(props){
		super(props)
	}

	state = { error: false, loading: false }

	pickSong = async () => {
		this.setState({loading: true})
		// Pick a single file
		let file = {}
		try {
			const res = await DocumentPicker.pick({
				type: [DocumentPicker.types.audio],
			})
			let tmpPath = `${RNFS.DocumentDirectoryPath}/tmp`
			let fullFile = await RNFS.readFile(res.uri, 'base64')
			await RNFS.writeFile(tmpPath, fullFile, 'base64')
			file = {
				name: 'audio', 
				filename: res.name, 
				filepath: tmpPath, 
				filetype: res.type
			}
		} catch (err) {
			console.log(err)
			this.setState({loading: false, error: "Error, please try again"})
		}

		if(file.filetype){
			const worked = await Api.sendAudio(file)
			if(worked.ok){
				const {ss} = this.props
				this.setState({loading: false})
				if(ss){
					ss(worked.song)
				}else{
					await AsyncStorage.setItem('newSong', worked.song)
					this.props.navigation.goBack()
				}
			}else{this.setState({error: worked.msg, loading: false})}
		}
	}

	render() {
		const {error, loading} = this.state
		return (
			<SafeAreaView style={styles.app}>
				{error && <Text style={styles.error}>{error}</Text>}
				<Text style={styles.container}> Try adding new songs!{"\n"} 
					To select multiple files, try the webpage {"\n"}
					<Text style={{color:'lime', textDecorationLine: 'underline',}} 
						onPress={() => Linking.openURL('https://tuba.work/player')}>
						tuba.work/player
					</Text>
				</Text>
				<Button title="Upload" onPress={this.pickSong} />
				{loading?<ActivityIndicator size="large" color="#00ff00" />:<Text></Text>}
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
	    color: '#ff0000',
	    margin: 10,
	},
})