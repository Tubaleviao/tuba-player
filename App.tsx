import 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Button } from 'react-native'
import React from 'react';

import Player from './components/player'
import Login from './components/login'
import Signup from './components/signup'
import Upload from './components/upload'
import Logout from './components/logout'

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()

const App = () => {
  const defaultOption = {
    headerTintColor: '#00ff00',
    headerStyle: { backgroundColor: '#000' },
  }

  let nav: any

  const toggleDrawer = (navi?: any) => {
    if ((typeof navi) === "object") nav = navi
    else if ((typeof nav) === "object") nav.toggleDrawer()
  }

  const drawerNav = () => {
    const playerOptions = ({ navigation }: { navigation: any }) => {
      toggleDrawer(navigation); return ({
        drawerActiveTintColor: "#0F0", drawerInactiveTintColor: "#090"
      });
    }

    return (
      <Drawer.Navigator screenOptions={{
        drawerPosition: 'right',
        drawerStyle: { backgroundColor: 'black' },
        header: () => null // gets rid of the header
      }} >
        <Drawer.Screen name="Player" component={Player} options={playerOptions} />
        <Drawer.Screen name="Upload" component={Upload} options={playerOptions} />
        <Drawer.Screen name="Logout" component={Logout} options={playerOptions} />
      </Drawer.Navigator>
    )
  }

  const loginOptions = ({ navigation }: { navigation: any }) => ({
    ...defaultOption,
    headerRight: () => (
      <Button onPress={() => navigation.navigate('Signup')}
        color='#006600' title="Sign up" />
    ),
  })

  const homeOptions = () => ({
    ...defaultOption,
    headerTitle: "Tuba Player",
    headerRight: () => (
      <Icon style={{ margin: 10 }} onPress={() => toggleDrawer()} size={32} color='#00ff00' name="bars" />
    ),
  })

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={loginOptions} />
        <Stack.Screen name="Home" children={() => drawerNav()} options={homeOptions} />
        <Stack.Screen name="Signup" component={Signup} options={defaultOption} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;
