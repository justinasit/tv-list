import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
      name: '',
    };
  }

  componentDidMount() {
    fetch('https://api.themoviedb.org/3/search/movie?api_key=b3487e6f673fc1e8d1fcbfa4feef3fb8&query=Groundhog')
    .then(results => {
      return results.json();
    }).then(data => {
      this.setState({name: data.results[0].original_title});
      console.log(data);
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Your TV List</h1>
        </header>
        <p className="App-intro">
          { this.state.name }
        </p>
      </div>
    );
  }
}

export default App;
