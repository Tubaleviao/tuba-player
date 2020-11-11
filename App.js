import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Player from './components/player'
import Login from './components/login'
import Signup from './components/signup'
import { Button } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Upload from './components/upload'
import Logout from './components/logout'

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()

 const App = () => {
  const defaultOption = {
    headerTintColor: '#00ff00',
    headerStyle: { backgroundColor: '#000000' },
  }

  let nav

  const savFun = navi => {
    if((typeof navi) === "object") nav = navi
    else if((typeof nav) === "object") nav.toggleDrawer()
  }

  const drawerNav = menu => {

    const drawerOptions = {
      activeTintColor: '#00ff00', labelStyle: {color:'#00ff00'}, 
      style: { borderColor: '#008800', borderWidth: .5, borderRadius: 1}
    }

    const playerOptions = ({navigation}) => { menu( navigation ); return ({}); }

    return (
      <Drawer.Navigator drawerPosition="right" drawerStyle={{backgroundColor: '#000000'}}
        drawerContentOptions={drawerOptions} >
        <Drawer.Screen name="Player" component={Player} options={playerOptions} />
        <Drawer.Screen name="Upload" component={Upload} />
        <Drawer.Screen name="Logout" component={Logout} />
      </Drawer.Navigator>
    )
  }

  const loginOptions = ({navigation}) => ({
    ...defaultOption,
    headerRight: () => (
       <Button onPress={() => navigation.navigate('Signup')} 
         color='#006600' title="Sign up"/>
     ),
   })

  const homeOptions = ({navigation}) => ({
    ...defaultOption,
    headerTitle: "Tuba Player",
    headerRight: () => (
      <Icon style={{margin: 10}} onPress={() => savFun()} size={32} color='#00ff00' name="bars"/>
    ),
  })
    
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} options={loginOptions} />
          <Stack.Screen name="Home" children={() => drawerNav(savFun)} options={homeOptions} />
          <Stack.Screen name="Signup" component={Signup} options={defaultOption} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default App