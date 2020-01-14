import myShows from './myShows'
import storedShows from './storedShows'
import {combineReducers} from 'redux'

const rootReducer = combineReducers({
    myShows,
    storedShows
})

export default rootReducer;