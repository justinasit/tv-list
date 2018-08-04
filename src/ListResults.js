import React from 'react';
import * as Tmdb from './api/Tmdb';

class ListResults extends React.Component {

    addShowCheck = (id) => {
        if (!this.props.showIds.map(show => show.id).includes(id)) {
          this.addShow(id);
        }
      }
    
    addShow = (id) => {
        this.props.showIds.push({id: id, seasons_watched: []});
        localStorage.setItem('showIds', JSON.stringify(this.props.showIds));
        Tmdb.getInfoById(id).then(data => {
            this.props.handler({
            myShows: [
                ...this.props.myShows,
                {name: data.name, number_of_seasons: data.number_of_seasons}
            ],
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

export default ListResults;