import React, {useEffect} from 'react'
import { View } from 'react-native'
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'

const Logout = ({navigation}) => {

    useEffect(() => {
        AsyncStorage.removeItem('user')
    }, [])
    
    const out = () => {
        navigation.dispatch(CommonActions.reset({ index: 1,routes: [{name: 'Login'}],}))
    }
    return (<View>{out()}</View>)
} 

export default Logout
