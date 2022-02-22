import TrackPlayer from "react-native-track-player";
export default async function() {

    TrackPlayer.addEventListener('remote-play', () => TrackPlayer.play());

    TrackPlayer.addEventListener('remote-pause', () => TrackPlayer.pause());

    TrackPlayer.addEventListener('remote-stop', () => TrackPlayer.destroy());


    TrackPlayer.addEventListener('remote-jump-forward', async () => {
        try{
            let newPosition = await TrackPlayer.getPosition();
            let duration = await TrackPlayer.getDuration();
            newPosition += 10;
            if (newPosition > duration) {
              newPosition = duration;
            }
            await TrackPlayer.seekTo(newPosition);
        }
        catch(e){
            console.log(e)
        }
        
      });
      
    TrackPlayer.addEventListener('remote-jump-backward', async () => {
        try{
            let newPosition = await TrackPlayer.getPosition();
            newPosition -= 10;
            if (newPosition < 0) {
              newPosition = 0;
            }
            TrackPlayer.seekTo(newPosition);
        }
        catch(e){
            console.log(e)
        }
      
    });

    
}
