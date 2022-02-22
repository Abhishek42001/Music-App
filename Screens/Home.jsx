import React from 'react'
import {View,Text,ImageBackground,RefreshControl,StyleSheet,Image} from "react-native"
import { ScrollView } from 'react-native-gesture-handler';
import {TouchableRipple} from "react-native-paper"
import Carousel from 'react-native-snap-carousel';
import { bindActionCreators } from 'redux';
import authHandler from '../components/Authhandler';
import {connect} from "react-redux"
import LoadingBg from "../Assets/wp4371980-loading-wallpapers.png"
import Icon from 'react-native-vector-icons/Octicons';

import token_action from '../Redux/token_action';

const myicon=<Icon name="play" color="violet" size={50}/>
function Home({navigation,route,token,dispatcher}) {

    const [activeindex,setActiveindex]=React.useState(0)
    const [data,setData]=React.useState(null)



    const getdata=async()=>{
        try{
            var queryparam = "?country=US";
            //album released data
            const albumresult=await fetch('https://api.spotify.com/v1/browse/new-releases'+queryparam, {
                method: 'GET', 
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token.accessToken,  
                }
            })
            console.log(albumresult.status)
            if(albumresult.status===401){
                navigation.navigate("Login")
            }
            const data1=await albumresult.json()


            //artist released data
            const artistresult=await fetch('https://api.spotify.com/v1/artists/246dkjvS1zLTtiykXe5h60/top-tracks'+queryparam, {
                method: 'GET', 
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token.accessToken,  
                }
            })
            if(artistresult.status===401){
                navigation.navigate("Login")
            }
            const data=await artistresult.json();



            //featured playlist
            const featuredplaylist=await fetch('https://api.spotify.com/v1/browse/featured-playlists'+queryparam, {
                method: 'GET', 
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token.accessToken,  
                }
            })
            if(featuredplaylist.status===401){
                navigation.navigate("Login")
            }
            const data3=await featuredplaylist.json();


            //Recommended Tracks
            const recommendedtracks=await fetch('https://api.spotify.com/v1/recommendations'+queryparam, {
                method: 'GET', 
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token.accessToken,  
                }
            })
            if(recommendedtracks.status===401){
                navigation.navigate("Login")
            }
            const data4=await recommendedtracks.json();
            setData({albumData:data1.albums.items,
                postmalona:data.tracks,
                featuredplaylist:data3.playlists.items,
            })  
        }
        catch(e){
            console.log("Error:",e)
        }

    }
    React.useEffect(()=>{
        getdata();
        const unsubscribe=navigation.addListener("focus",()=>{
            getdata();
        })
        return ()=>unsubscribe()
    },[])

    const _renderItem=({item,index})=>{
        return (
            <TouchableRipple
                    onPress={() =>{navigation.navigate("Albumplayer",
                    {
                        item,
                        accessToken:token.accessToken,
                        imageurl:item.images[1].url
                    })}}
                    rippleColor="rgba(0, 0, 0, .32)"
                >
                <ImageBackground source={{uri:item.images?item.images[1].url:"https://media.istockphoto.com/photos/1980s-china-little-girl-and-father-old-photo-of-real-life-picture-id1307006329"}} resizeMode="cover" style={styles.backimag1}>
                    <View style={styles.backimag1view}>
                      <Text style={{fontSize: 30}}>{item.title}</Text>
                      <Text>{item.text}</Text>
                    </View>
                    <View style={styles.backimag1view2}>
                        <ScrollView>
                            <Text style={styles.backimag1itemname}>{item.name}</Text>
                            <Text style={styles.backimag1releaseson}>Released On:         {item.release_date}</Text>
                        </ScrollView>
                    </View>
                </ImageBackground>
            </TouchableRipple>
        )
    }

    const _renderItem2=({item,index})=>{

        return (
            <TouchableRipple
                    onPress={() =>{navigation.navigate("Albumplayer",
                    {
                        item,
                        accessToken:token.accessToken,
                        imageurl:item.album.images[1].url
                    })}}
                    rippleColor="rgba(0, 0, 0, .32)"
                >
                <ImageBackground source={{uri:item.album.images?item.album.images[0].url:"https://media.istockphoto.com/photos/1980s-china-little-girl-and-father-old-photo-of-real-life-picture-id1307006329"}} resizeMode="cover" style={styles.backimag2}>
                    <View style={styles.backimag2view2}>
                      <Text style={{fontSize: 30}}>{item.title}</Text>
                      <Text>{item.text}</Text>
                    </View>
                    <View style={{height:"36%",width:"100%",position:'absolute',bottom:0,backgroundColor:"rgba(52,52,52,0.8)"}}>
                        <ScrollView>
                            <Text style={styles.backimag2itemname}>{item.name}</Text>
                            <Text style={styles.backimag2releasname}>Released On:         {item.album.release_date}</Text>
                        </ScrollView>
                    </View>
                </ImageBackground>
            </TouchableRipple>
        )
    }

    const _renderItem3=({item,index})=>{
        return (
        
            <ImageBackground source={{uri:item.images?item.images[0].url:"https://media.istockphoto.com/photos/1980s-china-little-girl-and-father-old-photo-of-real-life-picture-id1307006329"}} resizeMode="cover" style={styles.backimag3}>
                <View style={styles.backimag3view}>
                    {myicon}
                </View>
                <View style={styles.backimag3view2}>
                  <Text style={{fontSize: 30}}>{item.title}</Text>
                  <Text>{item.text}</Text>
                </View>
                <View style={styles.backimag3view3}>
                    <Text style={styles.backimag3itemname}>{item.name}</Text>
                </View>
            </ImageBackground>
        )
    }
    const loadingbg=()=>(
        <Image  
            source={LoadingBg}
            style={styles.loadingbg}
        />
    )
    return (
        <View style={{height:"100%",backgroundColor:"#006666"}}>
            <ScrollView> 
                {/* newly realeased albums */}
                <View style={{marginTop:12}}><Text style={{textAlign:'center',color:"white",fontWeight:"bold"}}>Newly Released Albums</Text></View>
                <View style={{alignItems:"center",marginTop:20}}>
                    {data?
                        <Carousel
                            layout={"default"}
                            data={data.albumData}
                            sliderWidth={300}
                            itemWidth={250}
                            renderItem={_renderItem}
                            onSnapToItem = { index => setActiveindex(index) } />
                    :loadingbg()}
                </View>
                {/* Post Malone New Relases */}
                <Text></Text>
                <View style={{marginTop:12}}><Text style={{textAlign:'center',color:"white",fontWeight:"bold"}}>Post Malone New Released Albums</Text></View>
                <View style={{alignItems:"center",marginTop:20}}>
                    {data?<Carousel
                        layout={"default"}
                        data={data.postmalona}
                        sliderWidth={300}
                        itemWidth={250}
                        renderItem={_renderItem2}
                        onSnapToItem = { index => setActiveindex(index) } />:loadingbg()}
                </View>
                
                {/* //featured playlists */}
                <Text></Text>
                <View style={{marginTop:12}}><Text style={{textAlign:'center',color:"white",fontWeight:"bold"}}>Featured Playlists</Text></View>
                <View style={{alignItems:"center",marginTop:20,marginBottom:20}}>
                    {data?<Carousel
                        layout={"default"}
                        data={data.featuredplaylist}
                        sliderWidth={300}
                        itemWidth={250}
                        renderItem={_renderItem3}
                        onSnapToItem = { index => setActiveindex(index) } />:loadingbg()}
                </View>
            </ScrollView>
        </View>
    )
}


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

const styles=StyleSheet.create({
    backimag1:{
        height:150,
        width:250,
        borderWidth:0.4
    },
    backimag1view:
    {
        borderRadius: 5,
        height: 200,
        padding: 50,
        marginLeft: 25,
        marginRight: 25, 
    },
    backimag1view2:
    {
        height:"36%",
        width:"100%",
        position:'absolute',
        bottom:0,
        backgroundColor:"rgba(52,52,52,0.8)"
    },
    backimag1itemname:
    {
        color:"#3EB489",
        paddingTop:8,
        textAlign:"center",
        fontWeight:"bold",
        fontSize:15
    },
    backimag1releaseson:
    {
        color:"white",
        paddingTop:2,
        textAlign:"center",
        fontSize:12
    },
    backimag2:
    {
        height:150,
        width:250,
        borderWidth:0.4
    },
    backimag2view2:
    {
        borderRadius: 5,
        height: 200,
        padding: 50,
        marginLeft: 25,
        marginRight: 25, 
    },
    backimag2itemname:
    {
        color:"#3EB489",
        paddingTop:8,
        textAlign:"center",
        fontWeight:"bold",
        fontSize:15
    },
    backimag2releasname:
    {
        color:"white",
        paddingTop:2,
        textAlign:"center",
        fontSize:12
    },
    backimag3:
    {
        height:150,
        width:250,
        borderWidth:0.4
    },
    backimag3view:
    {
        backgroundColor:"rgba(0,0,0,0.2)",
        height:"100%",
        position:"absolute",
        left:0,
        right:0,
        justifyContent:"center",
        alignItems:"center"
    },
    backimag3view2:
    {
        borderRadius: 5,
        height: 200,
        padding: 50,
        marginLeft: 25,
        marginRight: 25, 
    },
    backimag3view3:
    {
        height:"36%",
        width:"100%",
        position:'absolute',
        bottom:0,
        right:0,
        backgroundColor:"rgba(0,0,0,0.3)"
    },
    backimag3itemname:
    {
        color:"#FE840E",
        paddingTop:8,
        textAlign:"center",
        fontWeight:"bold",
        fontSize:15
    },
    loadingbg:{
        height:150,
        width:250,
        borderWidth:0.4
    }
})
export default connect(mapstatetoprops,mapdispatchtoprops)(Home);