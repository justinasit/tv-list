import React from 'react';
import * as Tmdb from '../api/Tmdb';
import Storage from '../Storage';
import { useDispatch, useSelector } from "react-redux";

const ListResults = (props) => {
  const storage = new Storage();
  const myShows = useSelector(state => state.myShows);
  const storedShows = useSelector(state => state.storedShows);
  const dispatch = useDispatch();

  /* If the show is already stored - no need to add it again */
  const addShowCheck = (id) => {
      if (!storedShows.map(show => show.id).includes(id)) {
        addShow(id);
      }
    }
  
  /* Add show id and season number to storage, update the state with show details */
  const addShow = (id) => {
    Tmdb.getInfoById(id).then(data => {
      if (data.number_of_seasons) {
        storedShows.push({id: id, seasons_watched: []});
        storage.setItem('storedShows', storedShows);
        dispatch({
          payload: {active: [
              ...myShows.active,
              {name: data.name, number_of_seasons: data.number_of_seasons, showIdIndex: storedShows.length-1, 
                id: data.id, last_aired_season: data.last_episode_to_air.season_number}
            ], finished: myShows.finished,
          },
          type: 'myShows'
        });
      } else {
        alert('Sorry, this show does not have a season number provided!');
      }
    });
  }

  return ( 
    <span>
      {props.items.map((item, index) => 
        <p key={index}>
            <li>{item.original_name}</li>
            <button id={'add-show-button-'+index} onClick={() => addShowCheck(item.id)}>Add</button>
        </p>
      )}
    </span> 
  )
}

export default ListResults;