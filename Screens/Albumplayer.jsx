import React, { Component } from 'react'
import {View,Text,Image,
        StyleSheet,Dimensions,Pressable,
        ImageBackground, TouchableOpacity, 
        ActivityIndicator,
        Alert} from "react-native"
import {Searchbar,List} from "react-native-paper"
import {RecyclerListView,DataProvider, LayoutProvider } from 'recyclerlistview'
import OptionsMenu from "react-native-option-menu";
import Icon2 from "react-native-vector-icons/Entypo"
import Icon3 from "react-native-vector-icons/Ionicons"
import Icon4 from "react-native-vector-icons/MaterialIcons"

class Albumplayer extends Component{
    constructor(props){
        super(props)
        this.state={
            dataProvider:new DataProvider((r1,r2)=>r1!=r2),
            data:[],
            id:null
        }
        this.threedot=<Icon2 name="dots-three-vertical" color="black" size={20}/>
        this.threedot2=<Icon2 name="dots-three-vertical" color="black" size={25}/>
        this.backicon=<Icon3 name="arrow-back" color="white" size={25}/>
        this.trackicon=<Icon4 name="audiotrack" color="#238ad9" size={25}/>
        this.fetchData.bind(this)
        this.changecolor.bind(this)
        this.tracksloader.bind(this)
    }


    layoutProvider=new LayoutProvider((index)=>(index),(type,dim)=>{
            dim.width=Dimensions.get("window").width;
            dim.height=70;
        }
    )


    fetchData=async()=>{
        // const queryparam="q=name:"+text+"&type=artist&market=US"
        const id=this.props.route.params.item.album?this.props.route.params.item.album.id:this.props.route.params.item.id
        try{
            const result=await fetch('https://api.spotify.com/v1/albums/'+id+'/tracks?', {
                method: 'GET', 
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.props.route.params.accessToken,  
                }
            })

            console.log(result.status)
            if(result.status===401)
                this.props.navigation.navigate("Login")
            const searcheddata=await result.json();
            this.setState({
                ...this.state,
                dataProvider:this.state.dataProvider.cloneWithRows([...this.state.data,...searcheddata.items]),
                data:searcheddata.items
            })
            
        }
        catch(e){
            Alert.alert("Oops!",e.message)
            console.log("Error1:",e)
        }
        
    }


    componentDidMount(){
        this.fetchData()
    }

    tracksloader(){
        return (
            <View style={{justifyContent:'center',alignItems:'center'}}>
                <ActivityIndicator/>
            </View>
        )
    }

    leftside(props,type,images){
        return(
            <View style={styles.leftside}>
                <View style={{justifyContent:'center',paddingLeft:4}}>
                    <Text style={{textAlignVertical:"center",color:"red"}}>{type+1}</Text>
                </View>
                <View style={{justifyContent:'center',paddingLeft:4}}>
                    {this.trackicon}
                </View>  
            </View>
        )
    }
    changecolor(id){
        if(this.state.id&&this.state.id===id){
            return "#228B22"
        }
        return "#f0ffff"
    }
    rowRenderer=(type,item)=>{
        return(
            <TouchableOpacity onPress={()=>{this.props.navigation.navigate("Player",{
                data:this.state.data,
                accessToken:this.props.route.params.accessToken,
                index:type,
                imageurl:this.props.route.params.imageurl,
                albumname:this.props.route.params.item.name?this.props.route.params.item.name:this.props.route.params.album.name
            })}}>
                <List.Item
                    style={{...styles.listitem,backgroundColor:this.changecolor(item.id)}}
                    title={item.name}
                    titleNumberOfLines={2}
                    titleStyle={{fontWeight:"bold",fontSize:16}}
                    descriptionStyle={{fontSize:11}}
                    description={item.artists[0].name}
                    left={props =>this.leftside(props,type,item.images)}
                    right={props=><View style={{justifyContent:'center',paddingRight:20}}>{this.threedot}</View>}
                />
            </TouchableOpacity>
        )
    }

    render(){
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n\n")

        return (
            <View style={styles.background}>
                <View style={styles.flex1}>
                    <ImageBackground source={{uri:this.props.route.params.item.images?this.props.route.params.item.images[1].url:this.props.route.params.item.album.images[1].url}} 
                        resizeMode="cover" style={styles.image}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={()=>{
                                this.props.navigation.goBack();
                            }}>
                                <View style={styles.backicon}>
                                    {this.backicon}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <View style={styles.threedot}>
                                    <OptionsMenu
  								        customButton={this.threedot2}
  								        buttonStyle={{ width: 32, height: 8, margin: 7.5, resizeMode: "contain" }}
  								        destructiveIndex={1}
  								        options={["Share", "Delete", "Cancel"]}
  								        //actions={[SharePost, deletePost]}
								    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.albumname}>
                            <Text style={styles.name}>{this.props.route.params.item.name?this.props.route.params.item.name:this.props.route.params.item.album.name}</Text>
                        </View>
                    </ImageBackground>
                </View>
                <View style={styles.flex2}>
                    <Searchbar style={styles.searchbar} 
                        iconColor="#b55e49"
                        placeholderTextColor="#b55e49"
                        placeholder="Search Song name"/>
                    <View style={styles.musicsection}>
                        {this.state.data.length?
                            <RecyclerListView 
                                rowRenderer={this.rowRenderer} 
                                extendedState={this.state}
                                dataProvider={this.state.dataProvider} 
                                layoutProvider={this.layoutProvider}/>
                                :this.tracksloader()}
                    </View>
                </View>
            </View>
        )
    }
    
}




const styles=StyleSheet.create({
    background:{height:"100%"},
    flex1:{height:"40%"},
    flex2:{
        height:"60%",
        backgroundColor:"#fff0f5",
    },
    searchbar:{
        margin:5,
        borderRadius:40,
        backgroundColor:"transparent",
        borderWidth:1,
        borderColor:"lightgray"
    },
    musicsection:{
        flex:1,
        backgroundColor:"#f0ffff",
        margin:8,
        borderTopLeftRadius:50,
        borderTopEndRadius:50,
        overflow:"hidden",
        elevation:25,
        shadowColor: '#52006A',
        shadowRadius:2,
    },
    leftside:{
        flexDirection:"row",
        paddingLeft:7,
        paddingRight:13
    },
    listitem:{
        paddingLeft:20,
        borderColor:"#b55e49",
    },
    image:{
        flex:1,
    },
    backicon:{
        borderRadius:30,
        backgroundColor:"rgba(0,0,0,0.3)",
        paddingLeft:5,
        paddingRight:5,
        paddingTop:4,
        paddingBottom:4
    },
    header:{
        flexDirection:"row",
        justifyContent:"space-between",
        padding:12
    },
    albumname:{
        marginTop:"auto",
        marginBottom:20,
        marginLeft:20
    },
    name:{
        fontSize:32,
        color:"yellow",
        fontWeight:"bold",
        fontStyle:"italic",
        textDecorationLine:"underline"
    },
    threedot:{
        justifyContent:'center',
        paddingRight:10
    },
    tinyLogo:{
        width: 50,
        height: 50,
    }
})
export default Albumplayer
