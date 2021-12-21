import { combineReducers } from 'redux';

const myShows = (state = {}, action) => {
  switch (action.type) {
    case 'myShows':
      return action.payload;
    default:
      return state;
  }
};
const storedShows = (state = {}, action) => {
  switch (action.type) {
    case 'storedShows':
      return action.payload;
    default:
      return state;
  }
};

const isLoading = (state = {}, action) => {
  switch (action.type) {
    case 'isLoading':
      return action.payload;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  myShows,
  storedShows,
  isLoading,
});

export default rootReducer;
