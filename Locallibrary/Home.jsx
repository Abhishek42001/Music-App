import React,{Component} from 'react'
import {View,Text,StyleSheet, Dimensions,ToastAndroid,Alert, RefreshControl,TouchableOpacity} from "react-native"
import * as MediaLibrary from 'expo-media-library';
import {RecyclerListView,DataProvider,LayoutProvider} from "recyclerlistview"
import Icon4 from "react-native-vector-icons/MaterialIcons"
import {List,ActivityIndicator} from "react-native-paper"
import Icon2 from "react-native-vector-icons/Entypo"
import OptionsMenu from "react-native-option-menu";
import Iconn from "react-native-vector-icons/FontAwesome5"
import TrackPlayer,{State} from 'react-native-track-player';
import Icon3 from "react-native-vector-icons/Feather";


import { Searchbar } from 'react-native-paper';

class Home extends Component{
    constructor(props){
        super(props)
        this.state={
            dataprovider:new DataProvider((r1,r2)=>r1!=r2),
            data:[],
            searcheddataprovider:new DataProvider((r1,r2)=>r1!=r2),
            refreshing:false,
            searcheddata:[],
            pauseicon:"play",
            currenttrackname:"",
            searchtext:""
        }
        this.trackicon=<Icon4 name="audiotrack" color="violet" size={30}/>
        this.threedot=<Icon2 name="dots-three-vertical" color="lightgray" size={20}/>
        this.prevplayicon=<Iconn name="step-backward" size={20}/>
        this.nextplayicon=<Iconn name="step-forward" size={20}/>
        this.closeicon=<Icon4 name="close" size={20} />

        this.handlesearch=this.handlesearch.bind(this);
        this.searcheddatafun=this.searcheddatafun.bind(this);
        this.alldata=this.alldata.bind(this);
        this.hidebottommenu=this.hidebottommenu.bind(this);
        this.pauseplay=this.pauseplay.bind(this)
        this.checkfortrack=this.checkfortrack.bind(this);
        this.notfound=this.notfound.bind(this);
    }
    layoutprovider=new LayoutProvider((index)=>index,(type,dim)=>{
        dim.width=Dimensions.get("screen").width 
        dim.height=70
    })

    async checkfortrack(){
        try{
            const res=await TrackPlayer.getCurrentTrack()
            const state=await TrackPlayer.getState();
            if(res){
                const {title}=await TrackPlayer.getTrack(res);
                
                if(state===State.Playing){
                    this.setState({
                        ...this.state,
                        currenttrackname:title,
                        pauseicon:"pause"
                    })
                    console.log("checking")
                }
                else
                    this.setState({
                        ...this.state,
                        currenttrackname:title,
                        pauseicon:"play"
                    })
            }
        }
        catch(e){
            console.log(e)
        }
        
    }

    async getAudiofiles(){
        try{
            let media=await MediaLibrary.getAssetsAsync({mediaType:"audio"});
            media=await MediaLibrary.getAssetsAsync({
                mediaType:'audio',
                first:media.totalCount,
                sortBy:MediaLibrary.SortBy.creationTime
            })
            console.log("here")
            this.setState({
                ...this.state,
                dataprovider:this.state.dataprovider.cloneWithRows(media.assets),
                data:media.assets,
                refreshing:false
            })
            ToastAndroid.show("Successfully Loaded",ToastAndroid.SHORT)
        
        }
        catch(e){
            this.setState({
                ...this.state,
                refreshing:false
            })
            console.log(e)
        }
    }
    //Inside the first if condition we are checking if status is equal to 'denied' and we canAskAgain. 
    //Then it means the user denied the request but doesn't tick that little box “Don’t ask again”.
    async getPermission(){
        try{
            const result=await MediaLibrary.getPermissionsAsync();
            const {granted,canAskAgain}=result
            if(granted)
                this.getAudiofiles();
            else if(!granted){
                const r2=await MediaLibrary.requestPermissionsAsync();
                this.getAudiofiles()
            }
            
        }
        catch(e){
            console.log(e)
        }
        
    }

    componentDidMount(){
        console.log("cdm")
        //https://reactnavigation.org/docs/navigation-events/
        this._unsubscribe=this.props.navigation.addListener("focus",()=>{
            this.checkfortrack();
        })
        
        this.getPermission();
        this.checkfortrack();
    }
    componentWillUnmount(){
        this._unsubscribe();
    }

    rowrender=(type,item)=>{
        
        const handleshare=async()=>{
            try{
                await Share.open({
                    title:"Sharing audio",
                    url:item.url,
                })
            }
            catch(e){
                console.log(e)
            }
        }
        return(
        <View style={styles.listitemview}>
            <TouchableOpacity 
                        onPress={()=>{this.props.navigation.navigate("Localplayer",{
                        index:type,
                        addsongstoplayer:true,
                        data:this.state.searcheddata.length?this.state.searcheddata:this.state.data
                    })
                }
            }
            >
                <List.Item
                    style={styles.listitem}
                    title={item.filename}
                    titleStyle={{fontSize:16,color:"white"}}
                    left={props =><View style={styles.lefticon}>{this.trackicon}</View>}
                    right={props=> 
                            <View style={styles.righticon}>
                                <OptionsMenu
                                    customButton={this.threedot}
                                    buttonStyle={{ width: 32, height: 8, margin: 7.5, resizeMode: "contain" }}
                                    destructiveIndex={1}
                                    options={["Share", "Cancel"]}
                                    actions={[handleshare]}
                                />
                            </View>
                    }
                />
            </TouchableOpacity>
        </View>

    )}

    handlesearch=(text)=>{
        if(text.length===0){
            this.setState({
                ...this.state,
                searcheddataprovider:this.state.searcheddataprovider.cloneWithRows([]),
                searcheddata:[],
                searchtext:""
            })
        }
        const data=this.state.data.filter(item=>{
            return item.filename.toLowerCase().includes(text.toLowerCase())
        })
        console.log(data)
        this.setState({
            ...this.state,
            searcheddataprovider:this.state.searcheddataprovider.cloneWithRows(data),
            searcheddata:data,
            searchtext:text
        })
        console.log(this.state.searcheddata)
        
    }
    alldata(){
        if(this.state.data.length)
            return(
                <RecyclerListView
                    scrollViewProps={
                        {refreshControl:
                            <RefreshControl
                              refreshing={this.state.refreshing}
                              onRefresh={()=>{this.setState({
                                    ...this.state,
                                    refreshing:true
                                })
                                ;this.getAudiofiles()}}
                                progressBackgroundColor={"green"}
                                />}
                    }
                    layoutProvider={this.layoutprovider}
                    dataProvider={this.state.dataprovider}
                    rowRenderer={this.rowrender}
                />
            )
        else{
            // console.log("under else")
            return(
                <View style={styles.loader}>
                    <Text style={{fontSize:24,color:"green"}}>Loading Songs...</Text>
                    <Text>{"\n"}</Text>
                    <ActivityIndicator color='red' size={45}/>
                </View>
            )
        }
    }

    searcheddatafun(){
        console.log("this is")
        return(
            <RecyclerListView
                // scrollViewProps={
                //     refreshControl=
                //         <RefreshControl
                //           refreshing={this.state.refreshing}
                //           onRefresh={this.getAudiofiles()}
                //         />
                // }
                layoutProvider={this.layoutprovider}
                dataProvider={this.state.searcheddataprovider}
                rowRenderer={this.rowrender}
            />
        )
    }

    notfound(){
        return (
            <View style={styles.notfound}>
                <Text style={{color:'gray'}}>not found...</Text>
            </View>
        )
    }

    // songshare=async()=>{
    //     try{
    //         await Share.open({
    //             title:"Sharing audio",
    //             url:tracks[songindex].url,
    //         })
    //     }
    //     catch(e){
    //         console.log(e)
    //     }
  
    // }
    hidebottommenu(){
        TrackPlayer.destroy()
        this.setState({
            ...this.state,
            currenttrackname:""
        })
    }

    async pauseplay(){
        try{
			if(this.state.pauseicon==="pause"){
                await TrackPlayer.pause()
				ToastAndroid.show("Song Paused",ToastAndroid.SHORT)
				this.setState({
                    ...this.state,
                    pauseicon:"play"
                })
			}
			else{
                await TrackPlayer.play()
				ToastAndroid.show("Song Resumed",ToastAndroid.SHORT)
                this.setState({
                    ...this.state,
                    pauseicon:"pause"
                })
			}
		}
		catch(e){
			console.log("error from pause play:",e)
		}
    }    

    async handleprev(){
        try{
            await TrackPlayer.skipToPrevious()
            let result=await TrackPlayer.getCurrentTrack()
            result=await TrackPlayer.getTrack(result)
            this.setState({
                ...this.state,
                currenttrackname:result.title
            })
            
        }
        catch(e){
            console.log(e)
        }
    }
    async handlenext(){
        try{
            await TrackPlayer.skipToNext()
            let result=await TrackPlayer.getCurrentTrack()
            result=await TrackPlayer.getTrack(result)
            this.setState({
                ...this.state,
                currenttrackname:result.title
            })
            
        }
        catch(e){
            console.log(e)
        }
    }

    render() {

        return (
            <View style={{height:"100%",backgroundColor:"#414141"}}>
                <Searchbar
                    inputStyle={{color:"white"}}
                    style={{backgroundColor:"transparent"}}
                    placeholder="Search Any Music"
                    placeholderTextColor="gray"
                    onChangeText={this.handlesearch}
                    iconColor="gray"
                    // onChangeText={onChangeSearch}
                />  
                {this.state.searchtext.length?this.state.searcheddata.length?this.searcheddatafun():this.notfound():this.alldata()}
                {this.state.currenttrackname.length?
                <View style={styles.bottompauseplay}>
                    <View style={styles.songname}>
                        <TouchableOpacity onPress={()=>{
                                this.props.navigation.navigate("Localplayer",{
                                    addsongstoplayer:false,
                                }) 
                            }}>
                            <Text numberOfLines={2} style={{color:"white"}}>{this.state.currenttrackname}</Text>
                        </TouchableOpacity> 
                    </View>
                    <View style={styles.controls}>
                        <TouchableOpacity onPress={()=>this.handleprev()}>
                            {this.prevplayicon}  
                        </TouchableOpacity>

                        <TouchableOpacity onPress={this.pauseplay}>
                            <Icon3 name={this.state.pauseicon} size={35}/>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>this.handlenext()}>
                            {this.nextplayicon}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>this.hidebottommenu()}>
                            {this.closeicon}
                        </TouchableOpacity>
                    </View> 
                </View>:<View></View>}
            </View>
        )
    }
}

const styles=StyleSheet.create({
    listitem:{
        
    },
    listitemview:{
        height:70
    },
    lefticon:{
        marginRight:12
    },
    righticon:{
        justifyContent:'center',
        marginRight:20,
        marginLeft:15
    },
    loader:{
        justifyContent:'center',
        alignItems:'center',
        height:"70%"
    },
    bottompauseplay:{
        backgroundColor:"#00A170",
        flexDirection:"row",
        justifyContent:'space-around',
        position:'absolute',
        bottom:0,
        left:0,
        right:0,
        height:70,
    },
    controls:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:"center"
    },
    songname:{
        flex:1,
        justifyContent:"center",
        paddingLeft:10
    },
    notfound:{
        justifyContent:'center',
        alignItems:'center',
        height:"70%"
    }
})
export default Home
