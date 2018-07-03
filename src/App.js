import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

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
    fetch('https://api.themoviedb.org/3/search/tv?api_key=b3487e6f673fc1e8d1fcbfa4feef3fb8&query="'+this.state.term+'"')
    .then(results => {
      return results.json();
    }).then(data => {
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
          <img src={logo} className="App-logo" alt="logo" />
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
