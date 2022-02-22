import React from 'react'
import {DrawerContentScrollView, DrawerItemList,DrawerItem} from "@react-navigation/drawer"; 
import Icon from "react-native-vector-icons/MaterialIcons"
import {View,Text} from "react-native"
import {StyleSheet,Image} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Context from "../SearchbarComponent/CustomContext"
import { store } from '../Redux/store';
import Userphoto from "../Assets/avatar-gddfa7056c_1280.png"

function Sidebar(props) {   

    const [userData,setuserData]=React.useState(null)
    
    const getData=async()=>{
        try{
            const albumresult=await fetch('https://api.spotify.com/v1/me', {
                method: 'GET', 
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + props.store.getState().token.accessToken,  
                }
            })
            console.log(albumresult.status)
            if(albumresult.status===401){
                props.navigation.navigate("Login")
            }
            const data1=await albumresult.json()
            setuserData(data1)
            console.log("hel",data1)
        }
        catch(e){
            console.log(e)
        }
    }

    React.useEffect(()=>{
        getData()
    },[])

    const handlelogout=()=>{
        store.dispatch({type:"Change_value",payload:{}})
        props.navigation.closeDrawer();
        props.navigation.navigate("Login")
    }
    return (
        <DrawerContentScrollView  contentContainerStyle={{flex:1,paddingTop:0}} >
            <LinearGradient style={styles.flex1} colors={["#80ff72","#7ee8fa"]}>
                <View style={styles.photoview}>
                    <View style={styles.imageview}>
                        {console.log(userData)}
                        <Image
                            resizeMode='cover'
                            style={styles.image}
                            source={(userData&&userData.images&&userData.images.length)?{uri:userData.images[0].url}:Userphoto}
                        />
                    </View>
                    <View style={styles.name}>
                        <Text style={styles.nametext}>{userData&&userData.display_name}</Text>
                        {console.log(userData)}
                        <Text style={styles.followers}>Followers:  {userData&&userData.followers&&userData.followers.total}</Text>
                    </View>
                </View>
            </LinearGradient>
            <View style={styles.flex2}>
                <DrawerItemList {...props} />
                <DrawerItem
                    label="Rate Us"
                    icon={({tintColor,size})=>(<Icon name="grade" style={{fontSize:size}} color={tintColor} size={size}/>)}
                />
            </View>
            <View style={styles.flex3}>
                <DrawerItem
                    onPress={handlelogout}
                    label="Logout"
                    labelStyle={{fontWeight:"bold",fontSize:17}}
                    icon={({tintColor,size})=>(<Icon name="logout" style={{fontSize:size}} color={tintColor} size={size}/>)}
                />
            </View>
        </DrawerContentScrollView>
    )
}

const styles=StyleSheet.create({
    flex1:{
        flex:1,
    },
    flex2:{
        flex:2,
    },
    image:{
        width:80,
        height:80,
        borderWidth:1,
        borderRadius:50
    },
    photoview:{
        flex:1,
        justifyContent:'center',
    },
    name:{
        marginTop:7,
        marginLeft:40,
    },
    nametext:{
        color:"#955251",
        fontWeight:"bold",
        fontSize:20
    },
    followers:{
        marginTop:4,
        fontSize:14,
        color:"gray"
    },
    flex3:{
        flex:1/2,
        borderTopWidth:0.8,
        borderColor:"lightgray",
        justifyContent:'center'
    },
    imageview:
    {
        borderWidth:0.6,
        marginLeft:30,
        width:80,
        borderRadius:50,
        justifyContent:"center",
        alignItems:'center',
        borderColor:"violet"
    }
    
})
export default Sidebar;
