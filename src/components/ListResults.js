import React from 'react';
import * as Tmdb from '../api/Tmdb';
import Storage from '../Storage';

const ListResults = (props) => {
  const storage = new Storage();

  /* If the show is already stored - no need to add it again */
  const addShowCheck = (id) => {
      if (!props.storedShows.map(show => show.id).includes(id)) {
        addShow(id);
      }
    }
  
  /* Add show id and season number to storage, update the state with show details */
  const addShow = (id) => {
    Tmdb.getInfoById(id).then(data => {
      if (data.number_of_seasons) {
        props.storedShows.push({id: id, seasons_watched: []});
        storage.setItem('storedShows', props.storedShows);
        props.setMyShows({active: [
            ...props.myShows.active,
            {name: data.name, number_of_seasons: data.number_of_seasons, showIdIndex: props.storedShows.length-1}
          ], finished: props.myShows.finished,
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