import React, { Component } from 'react';
import './App.css';
import * as Tmdb from './api/Tmdb';

class App extends Component {

  constructor() {
    super();
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
        shows.push({name: data.name, number_of_seasons: data.number_of_seasons});
        if (shows.length === this.state.showIds.length) {
          this.setState({
            myShows: shows
          });
        }
      })
    );
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

  addShowCheck = (id) => {
    if (!this.state.showIds.map(show => show.id).includes(id)) {
      this.addShow(id);
    }
  }

  addShow = (id) => {
    this.state.showIds.push({id: id, seasons_watched: []});
    localStorage.setItem('showIds', JSON.stringify(this.state.showIds));
    Tmdb.getInfoById(id).then(data => {
      this.setState({
        myShows: [
            ...this.state.myShows,
            {name: data.name, number_of_seasons: data.number_of_seasons}
        ],
      });
    })
  }

  listSeasons = (numberOfSeasons, showIndex) => {
    let rows = [];
    for (var i = 1; i <= numberOfSeasons; i++) {
        rows.push(<span key={i}>Season {i} 
        <input defaultChecked={this.state.showIds[showIndex].seasons_watched.includes(i)}
          onChange={this.checkSeason.bind(this, i, showIndex)} type="checkbox"/>
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
                { this.listSeasons(item.number_of_seasons, index) }
              </li>
        </p>)}
          <form className="App-intro" onSubmit={this.onSubmit}>
            <input value={this.state.term} onChange={this.onChange} />
            <button>Submit</button>
          </form>
          { this.state.items.map((item, index) => 
            <p key={index}>
              <li>{item.original_name}</li>
              <button onClick={() => this.addShowCheck(item.id)}>Add</button>
            </p>) }
      </div>
    );
  }
}

export default App;
