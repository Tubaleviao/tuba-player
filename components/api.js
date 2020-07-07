import {AsyncStorage} from '@react-native-community/async-storage'

class Api {

	async sendAudio(audio){
		const form = new FormData()
		let user = await AsyncStorage.getItem('user')
		user = JSON.parse(user)
		form.append("token", user.token)
		form.append("audio", audio)
		let res
		try{
			let response = await fetch(`https://tuba.work/audio/${user.username}`, {
				method: 'POST',
				headers: {'Content-Type': 'multipart/form-data',
							'token': user.token},
				body: form
			})
			res = await response.json()
		}catch(err){
			console.log('eer: ', err)
		}
		return {ok: res.ok, song: res.song, msg: res.msg}
	}

	async getToken(body){
		let result
		try{
			const response = await fetch(`https://tuba.work/jwt`, {
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
		let response = await fetch(`https://tuba.work/songs`, options)
		if(response.ok) response = await response.json()
		else response = []
		return response
	}

	async signup(body){
		let result
		try{
			console.log(body)
			const response = await fetch(`https://tuba.work/join`, {
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