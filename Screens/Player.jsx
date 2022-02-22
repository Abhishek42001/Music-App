import React from 'react'
import Carousel from 'react-native-snap-carousel';
import {View,Text, ImageBackground,Dimensions, ToastAndroid,Pressable,StyleSheet,TouchableOpacity, Alert} from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import Icon2 from "react-native-vector-icons/Entypo"
import LinearGradient from 'react-native-linear-gradient';
import { Button,Portal,Provider,Modal} from 'react-native-paper';
import Slider from '@react-native-community/slider';
import Icon3 from "react-native-vector-icons/Feather"
import Icon4 from "react-native-vector-icons/FontAwesome5"
import Icon5 from "react-native-vector-icons/Feather"
import TrackPlayer from 'react-native-track-player';
import LottieView from 'lottie-react-native';
import OptionsMenu from "react-native-option-menu";

import * as Musicanimation from "../LottieAnimations/12778-audio-play-1.json"

const backicon=<Icon name="arrow-back-ios" size={20} />
const threedot=<Icon2 name="dots-three-vertical" size={20}/>
const prevplay=<Icon4 name="step-backward" size={20}/>
const nextplay=<Icon4 name="step-forward" size={20}/>
const shuffle=<Icon5 name="shuffle" size={20}/>
const repeat=<Icon5 name="repeat" size={20}/>


function Player({navigation,route}) {

	const [pauseicon,setpauseicon]=React.useState("pause")
	const pause=<Icon3 name={pauseicon} size={35}/>
    const data=React.useState(route.params.data)[0]
	const [shufflebg,setshufflebg]=React.useState("rgba(1,1,255, 0.1)")
	const [repeatbg,setrepeatbg]=React.useState("rgba(1,1,255, 0.1)")
	const [visible, setVisible] = React.useState(false);
	const [musicanimationref,setmusicanimationref]=React.useState(null)
	const musicanimationicon=<LottieView
	ref={animation => {
	  setmusicanimationref(animation);
	}} source={Musicanimation}/>

	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);
	const initial=React.useState("00:00")[0]
	React.useEffect(()=>{
		if(musicanimationref)
			musicanimationref.play();
	},[musicanimationref])
	React.useEffect(()=>{
		(async()=>{
			// console.log(route.params.accessToken)
			try{
				//song can be played here according to coming index
				
				console.log(data)
				const result=await fetch('https://api.spotify.com/v1/me/player/play', {
                	method: 'PUT', 
                	headers: {
                	    'Accept': 'application/json',
                	    'Content-Type': 'application/json',
                	    'Authorization': 'Bearer ' +route.params.accessToken,  
                	},
					body:{
						//because  i am just trying to play a song so random index(3) has been taken.
						"context_uri":data[0].uri,
  						// "offset": {
  						//   "position": 5
  						// },
					}
            	})
				const fetcheddata=await result.json()
				console.log("result:",fetcheddata)
				if(fetcheddata.error&&fetcheddata.error.reason==="PREMIUM_REQUIRED")
					Alert.alert("Oops!!",fetcheddata.error.message)
				else
					console.log("successfully played...")
				
			}
			catch(e){
				console.log("Error:",e)
				
			}
		})()
	},[])
    const renderItem = ({item, index}) => {

		return (
			<View>
				<View style={styles.itemflex1}>
            		<ImageBackground resizeMode="cover" style={styles.image} source={{uri:item.album?item.album.images[1].url:route.params.imageurl}}>
					</ImageBackground>
				</View>
				<View style={{height:"40%",
							justifyContent:"center",alignItems:'center'}}>
					<Text style={{fontSize:20,fontWeight:"bold",color:"yellow"}}>{item.name}</Text>
					<Text></Text>
					<View style={{width:150,alignItems:"center"}}><Text style={{color:"#b55e49"}}>{item.album?item.album.name:route.params.albumname}</Text></View>
				</View>
				
			</View>
        );
    }
	const pauseplay=async()=>{
		try{
			if(pauseicon==="pause"){
				// await TrackPlayer.pause();
				// const result=await fetch('https://api.spotify.com/v1/me/player/pause', {
                // 	method: 'PUT', 
                // 	headers: {
                // 	    'Accept': 'application/json',
                // 	    'Content-Type': 'application/json',
                // 	    'Authorization': 'Bearer ' + route.params.accessToken,  
                // 	},
            	// })
				
				// console.log("result:",await result.json())
				setpauseicon("play")
				musicanimationref&&musicanimationref.pause()
				ToastAndroid.show("Song Paused",ToastAndroid.SHORT)
			}
			else{
				// await TrackPlayer.play();
				// const result=await fetch('https://api.spotify.com/v1/me/player/play', {
                // 	method: 'PUT', 
                // 	headers: {
                // 	    'Accept': 'application/json',
                // 	    'Content-Type': 'application/json',
                // 	    'Authorization': 'Bearer ' + route.params.accessToken,  
                // 	},
				// 	body:{
				// 		"context_uri":"spotify:track:6jPNqIc5llDGJ9hr5GfIhV",
  				// 		// "offset": {
  				// 		//   "position": 5
  				// 		// },
				// 	}
            	// })
				// console.log("result:",await result.json())
				setpauseicon("pause")
				musicanimationref&&musicanimationref.play()
				ToastAndroid.show("Song Resumed",ToastAndroid.SHORT)
			}
		}
		catch(e){
			console.log("error from pause play:",e)
		}
		
	}
	const shufflepress=()=>{
		console.log("shufflepress")
		if(shufflebg==="#59b300"){
			console.log("under equality")
			setshufflebg("rgba(1,1,255, 0.1)")
			ToastAndroid.show("Shuffle Off",ToastAndroid.SHORT)
		}
		else{
			ToastAndroid.show("Shuffle On",ToastAndroid.SHORT)
			setshufflebg("#59b300")
		}
	}
	const repeatpress=()=>{
		if(repeatbg==="#59b300"){
			console.log("under equality")
			setrepeatbg("rgba(1,1,255, 0.1)")
			ToastAndroid.show("Repeat Off",ToastAndroid.SHORT)
		}
		else{
			setrepeatbg("#59b300")
			ToastAndroid.show("Repeat On",ToastAndroid.SHORT)
		}
	}

    return (
		<Provider>
			<LinearGradient colors={['#FA8BFF', '#2BD2FF', '#2BFF88']}>
        		<View style={{height:"100%"}}>
					<View style={{
							height:80,
							flexDirection:"row",
							justifyContent:'space-around',
							alignItems:"center"
						}}>
						<Pressable onPress={()=>{navigation.goBack()}}>
								{backicon}
						</Pressable>
						<Text style={{fontWeight:"bold",fontSize:16}}>Now Playing</Text>
						<View style={{justifyContent:'center',alignItems:"center"}}>
							<OptionsMenu
  								customButton={threedot}
  								buttonStyle={{ width: 32, height: 8, margin: 7.5, resizeMode: "contain" }}
  								destructiveIndex={1}
  								options={["Share", "Cancel"]}
  								//actions={[SharePost, deletePost]}
								/>
						</View>
					</View>
					<View style={{flex:2,paddingTop:14}}>
        		    	<Carousel
							firstItem={route.params.index}
							onSnapToItem={(index)=>{console.log("Index:",index)}}
        		    	    data={data}
							extraData={data}
        		    	    renderItem={renderItem}
        		    	    sliderWidth={Dimensions.get("window").width}
        		    	    itemWidth={200}
        		    	    inactiveSlideShift={150}
        		    	    inactiveSlideScale={0.6}
        		    	/>
					</View>
					<View style={{flex:1}}>
						<View style={{alignItems:'center',flex:1}}>
							<View style={{flex:1,width:90}}>
								{musicanimationicon}
							</View>
							<View style={{flex:1}}>
								<Slider
								  	style={{width:Dimensions.get("window").width-40,height: 40}}
								  	minimumValue={0}
								  	maximumValue={1}
								  	minimumTrackTintColor="green"
									thumbTintColor="white"
								  	maximumTrackTintColor="#000000"
								/>
							</View>
							<View style={{flexDirection:"row",width:Dimensions.get("screen").width,flex:1,alignItems:"center"}}>
								<View style={{paddingLeft:20}}>
									<Text style={{fontSize:15,color:"#45241c"}}>{initial}</Text>
								</View>
								<View style={{marginLeft:"auto",paddingRight:20}}>
									<Text style={{fontSize:15,color:"#45241c"}}>{initial}</Text>
								</View>
							</View>
						</View>
						<View style={styles.playercontrol}>
							<TouchableOpacity onPress={repeatpress}
      						>
								<View style={{...styles.repeat,backgroundColor:repeatbg}}>
									{repeat}
								</View>
							</TouchableOpacity>
							<TouchableOpacity >
								<View style={styles.prevplay}>
									{prevplay}
								</View>
							</TouchableOpacity>
							<TouchableOpacity onPress={pauseplay}>
								<View style={styles.pause}>
									{pause}
								</View>
							</TouchableOpacity>
							<TouchableOpacity >
								<View style={styles.nextplay}>
									{nextplay}
								</View>
							</TouchableOpacity>
							<TouchableOpacity onPress={shufflepress}>
								<View style={{...styles.shuffle,backgroundColor:shufflebg}}>
									{shuffle}
								</View>
							</TouchableOpacity>
						</View>
					</View>
        		</View>
			</LinearGradient>
			<Portal>
				<Modal   visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
					<View style={styles.modalheader}>
						<Pressable onPress={hideModal}>
								{backicon}
						</Pressable>
						<Text style={{fontWeight:"bold",fontSize:16}}>Now Playing</Text>
						<View style={{justifyContent:'center',alignItems:"center"}}>
							<OptionsMenu
  								customButton={threedot}
  								buttonStyle={{ width: 32, height: 8, margin: 7.5, resizeMode: "contain" }}
  								destructiveIndex={1}
  								options={["Share", "Delete", "Cancel"]}
  								//actions={[SharePost, deletePost]}
								/>
						</View>
					</View>
					<View style={styles.lyricssection}>
						<Text style={{fontSize:30}}>
							Lyrics will appear here...
						</Text>
					</View>
        		</Modal>
			</Portal>
		</Provider>
    )
}
const styles=StyleSheet.create({
	repeat:{
		borderRadius:70,
		padding:10,
		borderWidth:0.4
	},
	prevplay:{
		borderRadius:70,
		padding:10,
		backgroundColor:"rgba(1,1,255, 0.1)",
		borderWidth:0.4
	}
	,
	pause:{
		borderRadius:70,
		padding:15,
		backgroundColor:"#ff4d4d"
	},
	nextplay:{
		borderRadius:70,
		padding:10,
		backgroundColor:"rgba(1,1,255, 0.1)",
		borderWidth:0.4
	},
	shuffle:{
		borderRadius:70,
		padding:10,
		borderWidth:0.4,
	},
	image:{
		flex:1,
		height:"100%",
		flexGrow:1
	},
	itemflex1:{
		borderWidth:1,
		borderRadius:18,
		padding:9,
		height:"60%",
		borderColor:"#ffe6e6"
	},
	containerStyle:{
		backgroundColor: 'white', 
		position:'absolute',
		bottom:0,
		left:0,
		right:0,
		height:"75%",
		justifyContent:'flex-start'
	},
	modalheader:{
		flex:1/6,
		height:80,
		flexDirection:"row",
		justifyContent:'space-around',
		alignItems:"center",
		
	},
	lyricssection:{
		justifyContent:'center',
		alignItems:'center',
		flex:1,
	},
	playercontrol:{
		flexDirection:"row",
		paddingTop:4,
		justifyContent:"space-around",
		alignItems:"center",
		flex:1
	}
})

export default Player


//if user snap an item then we can get the index of current item after snapping and afte that we can play the song 
//by fetching the object with index in the onsnaptoitem callback

//or we can store the index with usestate hook

//preview_url is null in returned response and if uri is tried then it is showing
// a message that premium account is needed