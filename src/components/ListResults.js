import React from 'react';
import * as MovieApi from '../api/MovieApi';
import Storage from '../Storage';
import { useDispatch, useSelector } from 'react-redux';

const ListResults = props => {
  const storage = new Storage();
  const myShows = useSelector(state => state.myShows);
  const storedShows = useSelector(state => state.storedShows);
  const dispatch = useDispatch();

  /* If the show is already stored - no need to add it again */
  const addShowCheck = id => {
    if (!storedShows.map(show => show.id).includes(id)) {
      addShow(id);
    }
  };

  /* Add show id and season number to storage, update the state with show details */
  const addShow = id => {
    MovieApi.getInfoById(id).then(data => {
      if (MovieApi.hasSeasons(data)) {
        storedShows.push({ id: id, seasons_watched: [] });
        storage.setItem('stored-shows', storedShows);
        dispatch({
          payload: {
            active: [
              ...(myShows.active ? myShows.active : []),
              MovieApi.mapApiDataToObject(data, storedShows.length - 1),
            ],
            finished: myShows.finished ? myShows.finished : [],
          },
          type: 'myShows',
        });
      } else {
        alert('Sorry, this show does not have a season number provided!');
      }
    });
  };

  return (
    <span>
      {props.items.map((item, index) => (
        <p key={index}>
          <li>{item.original_name}</li>
          <button id={'add-show-button-' + index} onClick={() => addShowCheck(item.id)}>
            Add
          </button>
        </p>
      ))}
    </span>
  );
};

export default ListResults;
