import React, { Component } from 'react';
import './App.css';
import * as Tmdb from './api/Tmdb';

class App extends Component {

  constructor() {
    super();
    this.state = {
      term: '',
      items: [],
    };
    
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
          { this.state.items.map((item, index) => <li key={index}>{item.original_name}</li>) }
      </div>
    );
  }
}

export default App;
