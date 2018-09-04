import React, { Component } from 'react';
import './App.css';
import * as Tmdb from './api/Tmdb';
import ListResults from './ListResults';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      term: '',
      items: [],
      showIds: [],
      myShows: []
    };
    if (localStorage.getItem('showIds')) {
      this.state.showIds = JSON.parse(localStorage.getItem('showIds'));
    }
    let shows = [];
    this.state.showIds.map((show) => 
      Tmdb.getInfoById(show.id).then(data => {
        shows.push({name: data.name, number_of_seasons: data.number_of_seasons, last_aired_season: data.last_episode_to_air.season_number});
        if (shows.length === this.state.showIds.length) {
          this.setState({
            myShows: shows
          });
        }
      })
    );
    this.handler = this.handler.bind(this)
  }

  handler(someValue) {
    this.setState(someValue);
  }

  onChange = (event) => {
    this.setState({ term: event.target.value });
  }

  onSubmit = (event) => {
    event.preventDefault();

    Tmdb.searchTv(this.state.term).then(data => {
      this.setState({
        term: '',
        items: data.results
      });
    });
  }

  listSeasons = (numberOfSeasons, showIndex, lastAiredSeason) => {
    let rows = [];
    for (var i = 1; i <= numberOfSeasons; i++) {
        rows.push(<span key={i}>Season {i} 
        <input defaultChecked={this.state.showIds[showIndex].seasons_watched.includes(i)}
          onChange={this.checkSeason.bind(this, i, showIndex)} type="checkbox"
          disabled={i>lastAiredSeason}
          />
        <br/></span>);
    }
    return <span>{rows}</span>;
  }

  isWatched = (seasonIndex, showIndex) => {
    return this.state.showIds[showIndex].seasons_watched.includes(seasonIndex);
  }

  checkSeason = (season, showIndex) => {
    if (this.state.showIds[showIndex].seasons_watched.includes(season)) {
      let seasonIndex = this.state.showIds[showIndex].seasons_watched.indexOf(season);
      this.state.showIds[showIndex].seasons_watched.splice(seasonIndex, 1);
    } else {
      this.state.showIds[showIndex].seasons_watched.push(season);
    }
    localStorage.setItem('showIds', JSON.stringify(this.state.showIds));
  }

  getAiredSeasonsNumber = (show) => {
    return show.last_episode_to_air.season_number;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Your TV List</h1>
        </header>
        { this.state.myShows.map((item, index) => 
            <p key={index}>
              <li>{item.name}
                <br/><br />
                { this.listSeasons(item.number_of_seasons, index, item.last_aired_season) }
              </li>
        </p>)}
          <form className="App-intro" onSubmit={this.onSubmit}>
            <input value={this.state.term} onChange={this.onChange} />
            <button>Submit</button>
          </form>
          <ListResults showIds={this.state.showIds} myShows={this.state.myShows} 
          items={this.state.items} handler = {this.handler} />
      </div>
    );
  }
}

export default App;
