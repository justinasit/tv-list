import React from 'react';
import * as Tmdb from './api/Tmdb';
import Storage from './Storage';

export default class ListResults extends React.Component {

  addShowCheck = (id) => {
      if (!this.props.storedShows.map(show => show.id).includes(id)) {
        this.addShow(id);
      }
    }
  
  addShow = (id) => {
      this.props.storedShows.push({id: id, seasons_watched: []});
      Storage.setItem('storedShows', this.props.storedShows);
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
              <button onClick={() => this.addShowCheck(item.id)}>Add</button>
          </p>
        )}
      </span> 
    )
  }
}