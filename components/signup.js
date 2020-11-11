import React from 'react'
import { SafeAreaView, View, Text, TextInput, Button,StyleSheet, StatusBar } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from './api'
import { CommonActions } from '@react-navigation/native';

class Signup extends React.Component{

	state = {
		error: false
	}

	change = event => {
		if(this.state.error) this.setState({error: false})
		const {name, value} = event
		this.setState({[name]: value})
	}

	submit = async event => {
		this.setState({loading: true})
		event.preventDefault()
		const {username, email, pass} = this.state
		const body = JSON.stringify({"username":username, "password": pass, "email": email})
		const user = await api.signup(body)
		if(!user.error){
			AsyncStorage.setItem('user', JSON.stringify(user.user))
			user.loading = false
			this.setState(user)
			const resetAction = CommonActions.reset({ index: 1,
                routes: [{name: 'Home'},],
            });
            this.props.navigation.dispatch(resetAction); 
			//this.props.navigation.replace('Home',{screen: "Player", params: {songs: [], user: username}})
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
						autoCapitalize='none'
						style={styles.input} 
						onChangeText={t => this.change({name: "email", value: t})} 
						autoCompleteType="email" 
						placeholderTextColor='#007700'
						placeholder="Email..." />
					
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

			</SafeAreaView>
		)
	}
}

export default Signup

const styles = StyleSheet.create({
	app: {
		backgroundColor: '#000000',
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
	},
	error: {
		textAlign: 'center',
    	backgroundColor: '#000000',
	    color: '#ff0000',
	    margin: 10,
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
})

/* 

this.submit

*/