import React from 'react'
import {View,Text,ActivityIndicator} from "react-native"
import { bindActionCreators } from 'redux'
import action from "../Redux/token_action"
import {connect} from "react-redux"
import { CommonActions } from '@react-navigation/native';

function Loading(props) {
    
    React.useEffect(()=>{
        if(Object.keys(props.token).length===0){
            props.navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    { name: 'Login' },
                  ],
                })
            );
        }
        else{
            props.navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    { name: 'DrawerHome' },
                  ],
                })
            );
        }
    },[])
    
    return (
        <View style={{justifyContent:"center",alignItems:'center',height:"100%"}}>
            <ActivityIndicator size={75} color="blue"/>
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
    return bindActionCreators({dispatcher:action},dispatch)
}
export default connect(mapstatetoprops,mapdispatchtoprops)(Loading)
