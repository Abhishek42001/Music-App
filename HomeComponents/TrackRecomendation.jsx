import React from 'react'
import Carousel from 'react-native-snap-carousel';

function TrackRecomendation() {
    return (
        <>
        <Text></Text>
        <View style={{marginTop:12}}><Text style={{textAlign:'center',color:"white",fontWeight:"bold"}}>Recommended Tracks</Text></View>
        <View style={{alignItems:"center",marginTop:20}}>
            {data&&<Carousel
                layout={"default"}
                data={data.featuredplaylist}
                sliderWidth={300}
                itemWidth={250}
                renderItem={_renderItem3}
                onSnapToItem = { index => setActiveindex(index) } />}
        </View>
        </>
    )
}

export default TrackRecomendation
