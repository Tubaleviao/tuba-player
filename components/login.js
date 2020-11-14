import React from 'react'
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, StatusBar} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from './api'

class Login extends React.Component {

	constructor(props){
		super(props)
	}

	componentDidMount(){
		AsyncStorage.getItem('user').then(user => {
			const j = JSON.parse(user)
			let loadSongs = async st => {
				st.songs = await api.getSongs(j)
				this.setState(st)
				this.props.navigation.replace('Home', {
					screen: "Player", params: {songs: st.songs, user: st.user.username}})
			}
			if(j && j.username){
				let st ={user: j, error:false, loading:false}
				loadSongs(st)
			}
		})
	}

	state = {
		user: false,
		loading: false,
		error: false,
		username: "",
		pass: "",
	}

	change = event => {
		if(this.state.error) this.setState({error: false})
		const {name, value} = event
		this.setState({[name]: value})
	}

	submit = async event => {
		this.setState({loading: true})
		event.preventDefault()
		const {username, pass} = this.state
		const body = JSON.stringify({"username":username, "password": pass})
		const user = await api.getToken(body)
		if(!user.error){
			AsyncStorage.setItem('user', JSON.stringify(user.user))
			user.loading = false
			user.songs = await api.getSongs(user.user)
			this.setState(user)
			this.props.navigation.replace('Home', {
				screen: "Player", params: {songs: user.songs, user: username}})
		}else{
			this.setState({error: user.error, loading: false})
		}
	}

	render(){ 
		const {error} = this.state
		return (
			<SafeAreaView style={styles.app}>
				<StatusBar barStyle="light-content" backgroundColor="#000000" />
				<Text style={styles.title}>Welcome</Text>
				{error && <Text style={styles.error}>{error}</Text>}
				<View style={styles.container}>
					<TextInput 
						autoCapitalize='none'
						style={styles.input} 
						onChangeText={t => this.change({name: "username", value: t})} 
						autoCompleteType="username" 
						autoFocus={true} 
						placeholderTextColor='#007700'
						placeholder="Username..." />
				</View>
				<View style={styles.container}>
					<TextInput 
						style={styles.input} 
						onChangeText={t => this.change({name: "pass", value: t})} 
						secureTextEntry={true} 
						autoCompleteType="password" 
						placeholderTextColor='#007700'
						placeholder="Password..." />
				</View>
				<Button color='#006600' onPress={this.submit} title="Submit" />
			</SafeAreaView>) 
	} 
}

export default Login

const styles = StyleSheet.create({
	app: {
		backgroundColor: '#000000',
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
	},
	container: {
		marginBottom: 15,
		flexDirection: 'row',
    	backgroundColor: '#000000',
	},
	input: {
		color: 'lime', 
		flex: 0.7, 
		textAlign: 'center', 
		backgroundColor:'#002200',
	},
	title: {
		color: '#00ff00',
		backgroundColor: '#000000',
		textAlign: 'center',
		margin: 15,
	},
	error: {
		textAlign: 'center',
    	backgroundColor: '#000000',
	    color: '#ff0000',
	    margin: 10,
	},
});
