import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import LoginScreen from './Screens/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from './Screens/Home';
import { TextInput } from 'react-native-paper';
import Searchbar from './Screens/Searchbar';
import Loading from './Screens/Loading';
import { PersistGate } from 'redux-persist/integration/react';
import {Provider} from "react-redux"
import {store,persistor} from "./Redux/store"
import Player from './Screens/Player';
import Albumplayer from './Screens/Albumplayer';
import Icon from "react-native-vector-icons/EvilIcons"
import Icon2 from "react-native-vector-icons/MaterialIcons"
import Icon3 from "react-native-vector-icons/MaterialCommunityIcons"
import LocalHome from "./Locallibrary/Home";
import Localplayer from './Locallibrary/Localplayer';
import Sidebar from './Sidebar/Sidebar';


const searchicon=<Icon name="search" size={25} />


const Stack=createStackNavigator();
const Drawer=createDrawerNavigator();



function Drawernavigator({navigation,route}){
	const disabledsearchbar=(navigation)=>{
		return(
			<Pressable onPress={()=>{navigation.navigate("Searchbar",{data:store.getState()})}} style={{flexDirection:"row",
				justifyContent:"center",backgroundColor:"#bfb5b2",borderRadius:20,padding:1}}>
				<View style={{justifyContent:'center',backgroundColor:"transparent",paddingLeft:3,paddingTop:3,paddingBottom:3}}>{searchicon}</View>
				<TextInput style={{width:200,height:30,padding:2,backgroundColor:"transparent"}} disabled={true} placeholder="Search a Song" />
			</Pressable>
		)
	}
	return(
		<Drawer.Navigator screenOptions={{headerBackgroundContainerStyle:{backgroundColor:"black"},
											drawerActiveBackgroundColor:"#BC243C",drawerActiveTintColor:"white"}} 
				drawerContent={props=><Sidebar store={store} {...props} />}>

			<Drawer.Screen  options={{
										headerTitle:(props)=>disabledsearchbar(navigation),
										headerStyle:{backgroundColor:"#3F69AA"},headerTintColor:"white",
										drawerIcon:({color})=><Icon3 name="web" color={color} size={25} />
									}} 
				name="Online" component={Home}/>
			<Drawer.Screen 
				options={{headerStyle:{backgroundColor:"#6B5B95"},
							headerTintColor:"white",drawerIcon:()=><Icon2 name="file-download" 
							size={25} />
						}} 
				name="Offline" component={LocalHome} />

		</Drawer.Navigator>
	)
}
export default function App() {
  	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<NavigationContainer>
					<Stack.Navigator screenOptions={{headerShown:false}}>
						<Stack.Screen name="Loading" component={Loading}/>
						<Stack.Screen name="Player" component={Player}/>
						<Stack.Screen name="Localplayer" component={Localplayer} />
						<Stack.Screen name="Albumplayer" component={Albumplayer}/>
						<Stack.Screen name="Login" component={LoginScreen}/>
						<Stack.Screen name="DrawerHome" component={Drawernavigator}/>
						<Stack.Screen name="Searchbar" component={Searchbar}/>
					</Stack.Navigator>
				</NavigationContainer>
			</PersistGate>
		</Provider>
  	);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
