import React from 'react';
import Header from './Header';
import Main from './Main';
import '../stylesheets/BaseStyle.css';

require('dotenv').config();

// this component will be rendered by our <___Router>
const App = () => (
  <div className="App">
    <Header />
    <Main />
  </div>
);

export default App;
