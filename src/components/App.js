import React from 'react';
import Header from './Header';
import Main from './Main';
import '../stylesheets/BaseStyle.css';
import styled from 'styled-components';

require('dotenv').config();

const Body = styled.div`
  text-align: center;
  background-color: #222;
  color: white;
`;

const App = () => {
  return (
    <Body>
      <Header />
      <Main />
    </Body>
  );
};

export default App;
