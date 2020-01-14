export default function reducer(state = {myShows: {active: [], finished: []}}, action) {
    return action.payload ? action.payload : null;
  }