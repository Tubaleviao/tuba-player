/**
 * @format
 */

import {AppRegistry} from 'react-native'
import App from './App'
import {name as appName} from './app.json'
import tp from 'react-native-track-player'

AppRegistry.registerComponent(appName, () => App)
tp.registerPlaybackService(() => require('./components/service.js'));
