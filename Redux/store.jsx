import { createStore } from "redux";
import tokenredcer from "./reducer"
import { persistReducer, persistStore} from "redux-persist";
import AsyncStorage from "@react-native-community/async-storage";

const persistconfig={
    key:"root",
    storage:AsyncStorage
}

const persistedreducer=persistReducer(persistconfig,tokenredcer);
let store=createStore(persistedreducer)

let persistor=persistStore(store)
export {store,persistor}