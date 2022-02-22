import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import Service from "./service"
import App from './App';
import Trackplayer from "react-native-track-player"
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

Trackplayer.registerPlaybackService(()=>Service)
