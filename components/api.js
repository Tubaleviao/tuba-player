import AsyncStorage from '@react-native-async-storage/async-storage'
import RNFS from 'react-native-fs';
const host = 'https://tuba.work'

class Api {

	async sendAudio(files){
		let user = await AsyncStorage.getItem('user')
		user = JSON.parse(user)
		let res
		try{
			let url = `${host}/audio/${user.username}`
			let r = await RNFS.uploadFiles({
				toUrl: url, 
				files: files, 
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'token': user.token,
				},
				fields: {'token': user.token}
			}).promise
			res = JSON.parse(r.body)
		}catch(err){
			console.log('eer: ', err, res)
			res = {ok: false, song: null, msg: `${err}`}
		}
		return res ? {ok: res.ok, song: res.song, msg: res.msg} : {ok: false}
	}

	async getToken(body){
		let result
		try{
			const response = await fetch(`${host}/jwt`, {
				method: 'POST',
				headers: {'Accept': 'application/json',
							'Content-Type': 'application/json'},
				body: body
			})
			const user = await response.json()
			if(user.ok){
				const {token, data: {username}} = user
				result = {user: 
					{username, token},
					error: false
				}
			}else{
				result = {error: user.msg}
				console.log(`Error ho: ${user.msg}`)
			}
		}catch(e){
			console.log(`Error he: ${e}`)
			result = {error: "Authentication failed"}
		}
		return result
	}

	async isValid(face_user){
		let result
		console.log(`valid`)
		const url = `https://graph.facebook.com/debug_token?`+
						`input_token=${face_user.accessToken}`+
						`&access_token=${face_user.accessToken}`
		try{
			const web = `/isValid`
			const response = await fetch(web, {
				method: 'POST',
				headers: {'Accept': 'application/json',
							'Content-Type': 'application/json'},
				body: JSON.stringify({url, face_user})
			})
			const res = await response.json()
			result = res
		}catch(e){
			console.error(`Error hi: ${e}`)
			result = {error: "Facebook token invalid"}
		}
		return result
	}

	async getSongs(user){
		const options = {headers: {"token": user.token}}
		let response = await fetch(`${host}/songs`, options)
		if(response.ok) response = await response.json()
		else response = []
		return response
	}

	async signup(body){
		let result
		try{
			const response = await fetch(`${host}/join`, {
				method: 'POST',
				headers: {'Accept': 'application/json',
							'Content-Type': 'application/json'},
				body: body
			})
			const user = await response.json()
			if(user.ok){
				const {token, data: {username}} = user
				result = {user: 
					{username, token},
					error: false
				}
			}else{
				result = {error: user.msg}
				console.log(`Error ho: ${user.msg}`)
			}
		}catch(e){
			console.log(`Error he: ${e}`)
			result = {error: "Authentication failed"}
		}
		return result
	}
}

export default new Api() // Singleton