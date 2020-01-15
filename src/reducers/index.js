import {combineReducers} from 'redux';

const myShows = (state = {}, action)  => action.payload ? action.payload : null;
const storedShows = (state = {}, action)  => action.payload ? action.payload : null;

const rootReducer = combineReducers({
    myShows,
    storedShows
})

export default rootReducer;