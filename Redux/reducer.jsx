const INITIAL_STATE={
    token:{}
}

function tokenReducer(state=INITIAL_STATE,action){
    switch(action.type){
        case "Change_value":
            return{
                token:action.payload
            }
        default:
            return state;
    }
}
export default tokenReducer