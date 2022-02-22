import React, { Component } from 'react';
import {
  View,ImageBackground,StyleSheet,Text, Dimensions, BackHandler,Alert
} from 'react-native';
import { Button } from 'react-native-paper';
import musicbackground from "../Assets/loginbackground.jpg"
import authHandler from '../components/Authhandler';
import {connect} from "react-redux"
import { bindActionCreators } from 'redux';

import token_action from '../Redux/token_action';


function LoginScreen({navigation,route,token,dispatcher}){
    const [backhandler,setBackhandler]=React.useState(null)

    React.useEffect(()=>{
        const unsubscribe=BackHandler.addEventListener("hardwareBackPress",()=>{
            Alert.alert(
                'Exit App',
                'Exiting the application?', [{
                    text: 'Cancel',
                    onPress: ()=> console.log('Cancel Pressed'), 
                    style: 'cancel'
                }, {
                    text: 'OK',
                    onPress: ()=> BackHandler.exitApp()
                }, ], {
                    cancelable: false
                }
             )
             return true;
        })
        setBackhandler(unsubscribe)
        return ()=>unsubscribe.remove();
    },[])
    return (
        <View style={styles.container}>
            <ImageBackground source={musicbackground} resizeMode="cover" style={styles.image} imageStyle={{opacity:0.8}}>
                <View style={{paddingTop:25,paddingLeft:30}}>
                    <Text style={{color:"white",fontSize:28}}>Music</Text>
                </View>
                <View style={{position:"absolute",bottom:130,width:250,alignSelf:"center"}}>
                    <View style={{marginBottom:30}}>
                        <Text style={{color:"white",fontWeight:"bold",fontSize:30}}>Music App</Text>
                        <Text></Text>
                        <Text style={{color:"white",fontSize:15}}>Explore New Music From Spotify and dive in to the world of music with best music experience...</Text>
                    </View>
                </View>
                <View style={{position:"absolute",bottom:90,alignSelf:"center"}}>
                    <Button style={{backgroundColor:"#ff4d4d"}} contentStyle={{height:40,width:250}}  mode="contained" onPress={() => authHandler.onLogin(navigation,dispatcher,backhandler)}>
                        Login
                    </Button>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles=StyleSheet.create({
    container:{
        height:"100%",
    },
    image:{
        height:"100%",
    }
})

const mapstatetoprops=(state)=>{

    return(
        {
            token:state.token
        }
    )
}
const mapdispatchtoprops=(dispatch)=>{

    return bindActionCreators({dispatcher:token_action},dispatch)
}
export default connect(mapstatetoprops,mapdispatchtoprops)(LoginScreen);