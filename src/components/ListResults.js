import React from 'react';
import * as Tmdb from '../api/Tmdb';
import Storage from '../Storage';

export default class ListResults extends React.Component {

  storage = new Storage();

  /* If the show is already stored - no need to add it again */
  addShowCheck = (id) => {
      if (!this.props.storedShows.map(show => show.id).includes(id)) {
        this.addShow(id);
      }
    }
  
  /* Add show id and season number to storage, update the state with show details */
  addShow = (id) => {
      this.props.storedShows.push({id: id, seasons_watched: []});
      this.storage.setItem('storedShows', this.props.storedShows);
      Tmdb.getInfoById(id).then(data => {
          this.props.handler({
          myShows: {active: [
              ...this.props.myShows.active,
              {name: data.name, number_of_seasons: data.number_of_seasons, showIdIndex: this.props.storedShows.length-1}
            ], finished: this.props.myShows.finished,
          },
        });
      })
    }

  render() {
    return ( 
      <span>
        {this.props.items.map((item, index) => 
          <p key={index}>
              <li>{item.original_name}</li>
              <button id={'add-show-button-'+index} onClick={() => this.addShowCheck(item.id)}>Add</button>
          </p>
        )}
      </span> 
    )
  }
}