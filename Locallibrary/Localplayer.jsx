import React from 'react'
import {View,Text,StyleSheet,Pressable,Dimensions,TouchableOpacity,ToastAndroid} from "react-native"
import LinearGradient from 'react-native-linear-gradient';
import Icon from "react-native-vector-icons/MaterialIcons";
import Icon2 from "react-native-vector-icons/Entypo";
import OptionsMenu from "react-native-option-menu";
import LottieView from 'lottie-react-native';
import Icon4 from "react-native-vector-icons/FontAwesome5"
import Icon5 from "react-native-vector-icons/Feather"
import TrackPlayer,{RepeatMode, State,useProgress,Capability,useTrackPlayerEvents,Event} from 'react-native-track-player';
import Icon3 from "react-native-vector-icons/Feather"
import * as HeartAnimation from "../LottieAnimations/66200-heart-lottie-animation.json";
import Slider from '@react-native-community/slider';
import Share from 'react-native-share';
import * as AudioSpectrum from "../LottieAnimations/61928-circular-audio-spectrum.json"


function Localplayer({navigation,route}) {

    const prevplay=<Icon4 name="step-backward" size={20}/>
    const nextplay=<Icon4 name="step-forward" size={20}/>
    const shuffle=<Icon5 name="shuffle" size={20}/>
    const repeat=<Icon5 name="repeat" size={20}/>
    const [pauseicon,setpauseicon]=React.useState("pause")
    const {position,duration,buffered}=useProgress()
    const [songnam,setsongnam]=React.useState(0)
	const pause=<Icon3 name={pauseicon} size={35}/>

    //android:requestLegacyExternalStorage="true" must add this in androidmanifest.xml 

    const [musicanimationref,setmusicanimationref]=React.useState(null)

    const backicon=<Icon name="arrow-back-ios" color="#99ff99" size={20} />
    const threedot=<Icon2 name="dots-three-vertical" color="#99ff99" size={20}/>
    const [shufflebg,setshufflebg]=React.useState("white")
	const [repeatbg,setrepeatbg]=React.useState("white")
    const [tracks,setTracks]=React.useState(route.params.data?route.params.data.map((item)=>{
        return(
            {
                title:item.filename,
                url:item.uri,
                duration:item.duration
            }
        )
    }):null)


    useTrackPlayerEvents([  
                            Event.RemotePlay,
                            Event.RemotePause
                        ], 
                            event=> {
                                if (event.type === Event.RemotePause) {
                                    pauseplay();
                                } 
                                else if(event.type===Event.RemotePlay){
                                    pauseplay();
                                }
                                // else if(event.type===Event.RemotePrevious){
                                //     handleprevplay();
                                // }
                                // else if(event.type===Event.RemoteNext){
                                //     handlenextplay();
                                // }
                            });
    
    const AudioSpectrumanim=<LottieView
	                            ref={animation => {
	                              setmusicanimationref(animation);
	                            }} source={AudioSpectrum}
                            />
    const HeartAnim=<LottieView
                        autoPlay loop
                        source={HeartAnimation}
                    />
    

    React.useEffect(()=>{
        
        if(route.params.addsongstoplayer){
            musicanimationref&&musicanimationref.play();
        }
        else{
            TrackPlayer.getState().then((res)=>{
                if(res===State.Playing){
                    musicanimationref&&musicanimationref.play();
                }
                else{
                    musicanimationref&&musicanimationref.pause();
                }
            })
        }
    
    },[musicanimationref])


    React.useEffect(()=>{

        if(route.params.addsongstoplayer)
            startPlaying();
        else{
            (async()=>{
                try{
                    const res=await TrackPlayer.getState()
                    const repres=await TrackPlayer.getRepeatMode()
                    if(res===State.Playing){
                        setpauseicon("pause")
                    }
                    else{
                        setpauseicon("play")
                    }
                    if(repres===1){
                        setrepeatbg("#59b300");
                    }
                    else{
                        setrepeatbg("white");
                    }
                    let result=await TrackPlayer.getCurrentTrack()
                    result=await TrackPlayer.getTrack(result)
                    setsongnam(result.title)
                }
                catch(e){
                    console.log(e)
                }
            })()
        }
    
        // return ()=>TrackPlayer.destroy();
    },[])  
    const startPlaying = async () => {
        // Set up the player
        try{
            // TrackPlayer.addEventListener("remote-next",()=>{
            //     handlenextplay();
            // })
        
        
            // TrackPlayer.addEventListener("remote-previous",()=>{
            //     handleprevplay();
            // })


            await TrackPlayer.setupPlayer();  
            
            await TrackPlayer.add(tracks.slice(route.params.index))
            await TrackPlayer.add(tracks.slice(0,route.params.index),0)
            // Add a track to the queue
            await TrackPlayer.add(tracks);
            
            // Start playing it
            TrackPlayer.updateOptions({
                stopWithApp:true,
                capabilities:[
                    Capability.Play,
                    Capability.Pause,
                    Capability.JumpForward,
                    Capability.JumpBackward,
                    // Capability.SkipToPrevious,
                    // Capability.SkipToNext
                ]
            })
            await TrackPlayer.play();
            await TrackPlayer.setRepeatMode(RepeatMode.Queue)
            let result=await TrackPlayer.getCurrentTrack()
            result=await TrackPlayer.getTrack(result)
            setsongnam(result.title)
            
        }
        catch(e){
            console.log("error from startplaying:",e)
        }
        
    };


    const pauseplay=async()=>{
		try{
			if(pauseicon==="pause"){
				
				musicanimationref&&musicanimationref.pause()
                await TrackPlayer.pause()
				ToastAndroid.show("Song Paused",ToastAndroid.SHORT)
				setpauseicon("play")
			}
			else{
                await TrackPlayer.play()
				musicanimationref&&musicanimationref.play()
				ToastAndroid.show("Song Resumed",ToastAndroid.SHORT)
				setpauseicon("pause")
			}
		}
		catch(e){
			console.log("error from pause play:",e)
		}
		
	}
	const shufflepress=async()=>{
        try{
            console.log("shufflepress")
		    if(shufflebg==="#59b300"){
		    	setshufflebg("white")
		    	ToastAndroid.show("Shuffle Off",ToastAndroid.SHORT)
		    }
		    else{
		    	ToastAndroid.show("Shuffle On",ToastAndroid.SHORT)
		    	setshufflebg("#59b300")
		    }
        }
        catch(e){

        }
		
	}
	const repeatpress=async()=>{
        try{
            if(repeatbg==="#59b300"){
                await TrackPlayer.setRepeatMode(RepeatMode.Off)
                setrepeatbg("white")
                ToastAndroid.show("Repeat Off",ToastAndroid.SHORT)
            }
            else{
                await TrackPlayer.setRepeatMode(RepeatMode.Track)
                setrepeatbg("#59b300")
                ToastAndroid.show("Repeat On",ToastAndroid.SHORT)
            }
        }
        catch(e){
            console.log(e)
        }
		
	}

    const handlenextplay=async()=>{
        try{
            await TrackPlayer.skipToNext();
            let result=await TrackPlayer.getCurrentTrack()
            result=await TrackPlayer.getTrack(result)
            setsongnam(result.title)
        }
        catch(e){
            console.log(e)
        }
    }

    const handleprevplay=async()=>{
        try{
            await TrackPlayer.skipToPrevious();
            let result=await TrackPlayer.getCurrentTrack()
            result=await TrackPlayer.getTrack(result)
            setsongnam(result.title)
        }
        catch(e){
            ToastAndroid.show(e.message,ToastAndroid.SHORT)
            console.log(e)
        }
    }

    const handleonvaluechange=async(position)=>{
        try{
            
            await TrackPlayer.seekTo(position)
        }
        catch(e){
            console.log("Handleonvaluechange:",e)
        }
    }
    const handleonslidingcom=async()=>{
        try{
            let result=await TrackPlayer.getCurrentTrack()
            result=await TrackPlayer.getTrack(result)
            setsongnam(result.title)
        }
        catch(e){
            console.log(e)
        }
    }

    const songshare=async()=>{
        try{
            let result=await TrackPlayer.getCurrentTrack()
            result=await TrackPlayer.getTrack(result)
            await Share.open({
                title:"Sharing audio",
                url:result.url,
            })
        }
        catch(e){
            console.log(e)
        }
  
    }
    const durationcalculator=(secnds)=>{
        let minute=Math.trunc(parseInt(secnds)/60).toString()
        let seconds=Math.trunc(parseInt(secnds)%60).toString()
        if(minute<10&&seconds<10){
            return "0"+minute+":"+"0"+seconds
        }
        else if(minute<10){
            return "0"+minute+":"+seconds
        }
        else if(seconds<10){
            return minute+":"+"0"+seconds
        }
    }
    return (
        <LinearGradient colors={['#414141', '#000000']}>
        	<View style={{height:"100%"}}>
				<View style={styles.header}>
					<Pressable style={styles.backicon} onPress={()=>{navigation.navigate("Offline",{
                    
                    })}}>
							{backicon}
					</Pressable>
					<Text style={{fontWeight:"bold",fontSize:16,color:"#99ff99"}}>Now Playing</Text>
					<View style={styles.threedot}>
						<OptionsMenu
  							customButton={threedot}
  							buttonStyle={{ width: 32, height: 8, margin: 7.5, resizeMode: "contain" }}
  							destructiveIndex={1}
  							options={["Share",  "Cancel"]}
  							actions={[songshare]}
						/>
					</View>
				</View>
                <View style={styles.audiospectrumstyls}>
                    <View style={{flexGrow:1}}>
                        {AudioSpectrumanim}
                    </View>
                    <View style={{alignItems:"center"}}>
                        <Text style={styles.songname}>{songnam}</Text>
                        <Text></Text>
                    </View>
                </View>
                <View style={{flex:1}}>
                    <View style={{flex:1/2}}>
                        {HeartAnim}
                    </View>
				    <View style={{flex:1/2,alignItems:'center'}}>
				    	<View style={{flex:1,justifyContent:'center'}}>
				    		<Slider
				    		  	style={{width:Dimensions.get("window").width-40,height: 40}}
                                onSlidingComplete={()=>handleonslidingcom()}
				    		  	minimumValue={0}
				    		  	maximumValue={duration}
				    		  	minimumTrackTintColor="blue"
                                value={position}
				    			thumbTintColor="white"
				    		  	maximumTrackTintColor="white"
                                onValueChange={(n)=>handleonvaluechange(n)}
				    		/>
				    	</View>
				    	<View style={styles.time}>
				    		<View style={{paddingLeft:20}}>
				    			<Text style={{fontSize:15,color:"red"}}>{durationcalculator(position)}</Text>
				    		</View>
				    		<View style={{marginLeft:"auto",paddingRight:20}}>
				    			<Text style={{fontSize:15,color:"red"}}>{durationcalculator(duration)}</Text>
				    		</View>
				    	</View>
				    </View>
				    <View style={{flex:1}}>
                        <View style={styles.playercontrol}>
				    	    <TouchableOpacity onPress={repeatpress}
      			    	    >
				    	    	<View style={{...styles.repeat,backgroundColor:repeatbg}}>
				    	    		{repeat}
				    	    	</View>
				    	    </TouchableOpacity>
				    	    <TouchableOpacity onPress={handleprevplay}>
				    	    	<View style={styles.prevplay}>
				    	    		{prevplay}
				    	    	</View>
				    	    </TouchableOpacity>
				    	    <TouchableOpacity onPress={pauseplay}>
				    	    	<View style={styles.pause}>
				    	    		{pause}
				    	    	</View>
				    	    </TouchableOpacity>
				    	    <TouchableOpacity onPress={handlenextplay}>
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
            </View>
        </LinearGradient>
    )
}


const styles=StyleSheet.create({
    header:{
        height:80,
		flexDirection:"row",
		justifyContent:'space-between',
		alignItems:"center"
    },
    audiospectrumstyls:{
        flex:1,
    },
    time:{
        flexDirection:"row",
        width:Dimensions.get("screen").width,
        flex:1
    },
    playercontrol:{
		flexDirection:"row",
		justifyContent:"space-around",
		alignItems:"center",
        marginTop:10
	},
    repeat:{
		borderRadius:70,
		padding:10,
		borderWidth:0.4
	},
	prevplay:{
		borderRadius:70,
		padding:10,
		backgroundColor:"white",
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
		backgroundColor:"white",
		borderWidth:0.4
	},
	shuffle:{
		borderRadius:70,
		padding:10,
		borderWidth:0.4,
	},
    songname:{
        color:'#ff9999',
        textAlign:'center',
        width:Dimensions.get("screen").width-80,


    },
    backicon:{
        marginLeft:20
    },
    threedot:{
        marginRight:20,
        justifyContent:'center',
        alignItems:"center"
    },

    
})
export default Localplayer
