import React, { Component } from 'react'
import {View,Text, Dimensions,Image} from "react-native"
import {RecyclerListView,DataProvider, LayoutProvider } from 'recyclerlistview'
import Context from "../SearchbarComponent/CustomContext"
import LottieView from 'lottie-react-native';
import * as  Notfound from "../LottieAnimations/10687-not-found.json"
import {List,TouchableRipple} from "react-native-paper"


class Album extends Component{
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
        const queryparam="q=name:"+text+"&type=album&market=US"
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
                dataProvider:this.state.dataProvider.cloneWithRows([...this.state.data,...searcheddata.albums.items]),
                data:searcheddata.albums.items
            })
        }
        catch(e){
            console.log("Error:",e)
        }
        
    }


    componentDidMount(){
        
        if(this.context.text.length)
            this.fetchData(this.context.text)
    }



    rowRenderer=(type,item)=>{

        return(
            <TouchableRipple
                onPress={() =>{this.props.navigation.navigate("Albumplayer",
                {
                    item,
                    accessToken:this.context.data.token.accessToken,
                    imageurl:item.images[1].url
                })}}
                rippleColor="rgba(0, 0, 0, .32)"
            >
                <List.Item
                    title={item.name}
                    description={"Total Tracks: "+item.total_tracks}
                    left={props => <Image style={{width:40,height:40,marginRight:15}} source={{uri:item.images.length?item.images[1].url:null}}/>}
                />
            </TouchableRipple>
        )
    }
    returnnotfound=()=>{
        return(
            <View style={{flex:1}}>
                <View style={{height:"30%",alignItems:"center",justifyContent:"flex-end"}}>
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
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Text style={{fontSize:17,color:"green"}}>Your Search will appear here...</Text>    
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

export default Album
