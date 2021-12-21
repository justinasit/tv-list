import React from 'react';
import Header from './Header';
import Main from './Main';
import '../stylesheets/BaseStyle.css';
import styled from 'styled-components';

const Body = styled.div`
  background-color: #222;
  color: white;
`;

const App = () => {
  return (
    <Body className="container-fluid">
      <Header />
      <Main />
    </Body>
  );
};

export default App;
