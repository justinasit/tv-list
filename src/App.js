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
      myShows: {active: [], finished: []}
    };
  }

  componentDidMount() {
    let showIds = [];
    if (localStorage.getItem('showIds')) {
      showIds = JSON.parse(localStorage.getItem('showIds'));
      this.setState({
        showIds: showIds
      });
    }
    let shows = {active: [], finished: []};
    showIds.map((show, showIdIndex) => 
      Tmdb.getInfoById(show.id).then(data => {
        shows = this.getShowData(shows, show, data, showIdIndex);
        if ((shows.finished.length + shows.active.length) === showIds.length) {
          this.setState({
            myShows: shows
          });
        }
      })
    );
    this.handler = this.handler.bind(this);
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
      last_aired_season: apiData.last_episode_to_air.season_number, showIdIndex: showIdIndex};
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

  checkSeason = (season, showIndex) => {
    if (this.state.showIds[showIndex].seasons_watched.includes(season)) {
      let seasonIndex = this.state.showIds[showIndex].seasons_watched.indexOf(season);
      this.state.showIds[showIndex].seasons_watched.splice(seasonIndex, 1);
    } else {
      this.state.showIds[showIndex].seasons_watched.push(season);
    }
    localStorage.setItem('showIds', JSON.stringify(this.state.showIds));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Your TV List</h1>
        </header>
        Active Shows
        { this.state.myShows.active.map((item, index) => 
            <p key={index}>
              <li>{item.name}
                <br/><br />
                { this.listSeasons(item.number_of_seasons, item.showIdIndex, item.last_aired_season) }
              </li>
        </p>)}
        Finished Shows
        { this.state.myShows.finished.map((item, index) => 
            <p key={index}>
              <li>{item.name}
                <br/><br />
                { this.listSeasons(item.number_of_seasons, item.showIdIndex, item.last_aired_season) }
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
