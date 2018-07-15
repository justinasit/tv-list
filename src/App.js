import React, { Component } from 'react';
import './App.css';
import * as Tmdb from './api/Tmdb';

class App extends Component {

  constructor() {
    super();
    this.state = {
      term: '',
      items: [],
      myShows: []
    };
    if (localStorage.getItem('myShows')) {
      this.state.myShows = JSON.parse(localStorage.getItem('myShows'));
    }    
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

  addShow = (id) => {
    if (!this.state.myShows.includes(id)) {
      this.state.myShows.push(id);
      localStorage.setItem('myShows', JSON.stringify(this.state.myShows));
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Your TV List</h1>
        </header>
          <form className="App-intro" onSubmit={this.onSubmit}>
            <input value={this.state.term} onChange={this.onChange} />
            <button>Submit</button>
          </form>
          { this.state.items.map((item, index) => 
            <p key={index}>
              <li>{item.original_name}</li>
              <button onClick={() => this.addShow(item.id)}>Add</button>
            </p>) }
      </div>
    );
  }
}

export default App;
