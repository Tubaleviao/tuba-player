/**
 * @format
 */


import {AppRegistry} from 'react-native'
import App from './App'
import {name as appName} from './app.json'

const sf = require('./components/service.js')
AppRegistry.registerComponent(appName, () => App)
AppRegistry.registerHeadlessTask('TrackPlayer', () => sf) // android only
//tp.registerPlaybackService(() => require('./components/service.js'));
