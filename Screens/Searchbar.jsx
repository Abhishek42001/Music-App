import React from 'react'
import {View,Text} from "react-native"
import {Searchbar as Searchbarr} from "react-native-paper"
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Track from '../SearchbarComponent/Track';
import Album from '../SearchbarComponent/Album';
import  Artist from "../SearchbarComponent/Artist"
import Context from "../SearchbarComponent/CustomContext"
import Icon from "react-native-vector-icons/MaterialIcons"
import { TouchableRipple } from 'react-native-paper';
const Tab = createMaterialTopTabNavigator();

const backicon=<Icon name="arrow-back-ios" size={25} color="white"/>
function Searchbar({navigation,route}) {
    const [text,setText]=React.useState("")


    const data=route.params.data
    return (
        <View style={{flex:1,backgroundColor:"#6B5B95"}}>
            <View style={{flexDirection:"row"}}>
                <TouchableRipple
                    style={{paddingLeft:15,width:40,justifyContent:"center",alignItems:"center"}}
                    onPress={() => navigation.goBack()}
                    rippleColor="rgba(0, 0, 0, .32)"
                    >
                    <View>{backicon}</View>
                </TouchableRipple>
                <Searchbarr autoFocus={true} onChangeText={setText} style={{margin:10,backgroundColor:"#DFCFBE",flex:1}}/>
            </View>
            <View style={{flex:1}}>
                <Context.Provider value={{text,data}}>
                    <Tab.Navigator  screenOptions={{tabBarStyle:{backgroundColor:"#88B04B"},
                            tabBarLabelStyle:{color:"white",fontWeight:"bold"}}}>
                        <Tab.Screen  name="Track"  component={Track} />
                        {/* <Tab.Screen name="Artist" component={Artist} /> */}
                        <Tab.Screen name="Album" component={Album}/>
                    </Tab.Navigator>
                </Context.Provider>
            </View>
        </View>
    )
}

export default Searchbar
