import React, { Component } from 'react';
import './App.css';
import * as Tmdb from './api/Tmdb';
import ListResults from './ListResults';
import Storage from './Storage';

export default class App extends Component {

  state = {
    term: '',
    items: [],
    storedShows: [],
    myShows: {active: [], finished: []}
  };
  storage = new Storage();

  /** Call the API to retrieve all user's stored show data */
  componentDidMount() {
    let storedShows = this.getStoredShows();
    let shows = {active: [], finished: []};
    storedShows.map((show, showIdIndex) => 
      Tmdb.getInfoById(show.id).then(data => {
        shows = this.getShowData(shows, show, data, showIdIndex);
        // Only change state on last element
        if ((shows.finished.length + shows.active.length) === storedShows.length) {
          this.setState({
            myShows: shows
          });
        }
      })
    );
    this.handler = this.handler.bind(this);
  }
  
  /* Get stored shows from storage on app load */
  getStoredShows = () => {
    let storedShows = [];
    if (this.storage.getItem('storedShows')) {
      storedShows = this.storage.getItem('storedShows');
      this.setState({
        storedShows: storedShows
      });
    }

    return storedShows;
  }

  /* Push show data from the API to either active or finished array */
  getShowData(showsArray, show, apiData, showIdIndex) {
    if (Math.max(...show.seasons_watched) === apiData.last_episode_to_air.season_number) {
      showsArray.finished.push(this.mapApiDataToObject(apiData, showIdIndex));
    } else {
      showsArray.active.push(this.mapApiDataToObject(apiData, showIdIndex));
    }

    return showsArray;
  }

  /* Map show data from the API to our shows object */
  mapApiDataToObject(apiData, showIdIndex) {
    return {name: apiData.name, number_of_seasons: apiData.number_of_seasons, 
      last_aired_season: apiData.last_episode_to_air.season_number, showIdIndex: showIdIndex, id: apiData.id};
  }

  handler(someValue) {
    this.setState(someValue);
  }

  setSearchTerm = (event) => {
    this.setState({ term: event.target.value });
  }

  searchApi = (event) => {
    event.preventDefault();

    Tmdb.searchTv(this.state.term).then(data => {
      this.setState({
        term: '',
        items: data.results
      });
    });
  }

  /* List seasons with checkboxes, disable checkboxes for seasons that haven't aired yet */
  listSeasons = (numberOfSeasons, showIndex, lastAiredSeason) => {
    let rows = [];
    for (var i = 1; i <= numberOfSeasons; i++) {
        rows.push(<span key={i}>Season {i} 
        <input defaultChecked={this.state.storedShows[showIndex].seasons_watched.includes(i)}
          onChange={this.checkSeason.bind(this, i, showIndex)} type="checkbox"
          disabled={i>lastAiredSeason}
          />
        <br/></span>);
    }
    return <span>{rows}</span>;
  }

  /* Update the seasons watched array in storage and state */
  checkSeason = (seasonNumber, showIndex) => {
    if (this.state.storedShows[showIndex].seasons_watched.includes(seasonNumber)) {
      const seasonIndex = this.state.storedShows[showIndex].seasons_watched.indexOf(seasonNumber);
      this.state.storedShows[showIndex].seasons_watched.splice(seasonIndex, 1);
    } else {
      this.state.storedShows[showIndex].seasons_watched.push(seasonNumber);
    }
    this.storage.setItem('storedShows', this.state.storedShows);
  }

  removeShow = (e, arrayKey, id) => {
    e.preventDefault();
    this.state.myShows[arrayKey].splice(0, 1);
    this.setState({
      myShows: {
        active: this.state.myShows.active,
        finished: this.state.myShows.finished
      }
    });
    this.storage.setItem('storedShows', this.state.storedShows.filter(show => id !== show.id));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Your TV List</h1>
        </header>
        Active Shows
        { (this.state.myShows.active.length === 0) ? <p>Nothing here!</p> : ''}
        { this.state.myShows.active.map((item, index) => 
            <p key={index}> 
              <li>{item.name} <button onClick={(e) => this.removeShow(e, 'active', item.id)} className="remove-button">Remove</button>
                <br/><br />
                { this.listSeasons(item.number_of_seasons, item.showIdIndex, item.last_aired_season) }
              </li>
        </p>)}
        Finished Shows
        { (this.state.myShows.finished.length === 0) ? <p>Nothing here!</p> : ''}
        { this.state.myShows.finished.map((item, index) => 
            <p key={index}> 
              <li>{item.name} <button onClick={(e) => this.removeShow(e, 'finished', item.id)} className="remove-button">Remove</button>
                <br/><br />
                { this.listSeasons(item.number_of_seasons, item.showIdIndex, item.last_aired_season) }
              </li>
        </p>)}
          <form className="App-intro" onSubmit={this.searchApi}>
            <input value={this.state.term} onChange={this.setSearchTerm} />
            <button>Submit</button>
          </form>
          <ListResults storedShows={this.state.storedShows} myShows={this.state.myShows} 
          items={this.state.items} handler = {this.handler} />
      </div>
    );
  }
}
