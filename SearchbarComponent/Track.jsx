import React, { Component } from 'react'
import {View,Text, Dimensions,Image,StyleSheet} from "react-native"
import {RecyclerListView,DataProvider, LayoutProvider } from 'recyclerlistview'
import Context from "../SearchbarComponent/CustomContext"
import LottieView from 'lottie-react-native';
import * as  Notfound from "../LottieAnimations/10687-not-found.json"
import {List} from "react-native-paper"
import {TouchableRipple} from "react-native-paper"
class Track extends Component{
    static contextType=Context;
    constructor(props,context){
        super(props)
        this.state={
            dataProvider:new DataProvider((r1,r2)=>r1!=r2),
            text:context.text,
            data:[]
        }
        this.fetchData.bind(this)
    }


    layoutProvider=new LayoutProvider((index)=>(index),(type,dim)=>{
            dim.width=Dimensions.get("window").width;
            dim.height=70;
        }
    )


    fetchData=async(text)=>{
        const queryparam="q=name:"+text+"&type=track&market=US"
        try{
            const result=await fetch('https://api.spotify.com/v1/search?'+queryparam, {
                method: 'GET', 
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.context.data.token.accessToken,  
                }
            })

            console.log(result.status)
            if(result.status===401)
                this.props.navigation.navigate("Login")
            const searcheddata=await result.json();
            this.setState({
                ...this.state,
                text:text,
                dataProvider:this.state.dataProvider.cloneWithRows(searcheddata.tracks.items),
                data:searcheddata.tracks.items
            })
        }
        catch(e){
            console.log("Error:",e)
        }
        
    }


    componentDidMount(){
        this.fetchData(this.context.text)
    }



    rowRenderer=(type,item)=>{ 
        return(
            <TouchableRipple
                onPress={() =>{this.props.navigation.navigate("Player",{item,data:this.state.data,accessToken:this.context.data.token.accessToken,index:type});console.log(this.state.data.length)}}
                rippleColor="rgba(0, 0, 0, .32)"
            >
                <List.Item
                    title={item.name}
                    description={item.artists[0].name}
                    left={props => <Image style={styles.image} source={{uri:item.album.images[1].url}}/>}
                />
            </TouchableRipple>
        )
    }
    returnnotfound=()=>{
        return(
            <View style={{flex:1}}>
                <View style={styles.notfound}>
                    <Text style={{fontSize:25,color:"red"}}>Oops!  Not Found</Text>
                    <Text></Text>
                    <Text style={{fontSize:15,color:"green"}}>Try with Different Name...</Text>
                </View>
                <LottieView  source={Notfound} autoPlay loop />          
            </View>
        )
    }
    returninitiatesearch=()=>{
        return(
            <View style={styles.initiatesearch}>
                <Text style={{fontSize:18,color:"green"}}>Your Search will appear here...</Text>    
            </View>
        )
    }
    render(){
        if(this.state.text!==this.context.text){
            this.fetchData(this.context.text)
        }
        return(
            <View style={{flex:1}}>
                {this.state.text?this.state.data.length?<RecyclerListView rowRenderer={this.rowRenderer} 
                    dataProvider={this.state.dataProvider} 
                    layoutProvider={this.layoutProvider}/>:this.returnnotfound():this.returninitiatesearch()}
            </View>
        ) 
    }
    
}

const styles=StyleSheet.create({
    image:{
        width:40,
        height:40,
        marginRight:15
    },
    notfound:{
        height:"30%",
        alignItems:"center",
        justifyContent:"flex-end"
    },
    initiatesearch:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})

export default Track
