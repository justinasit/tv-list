import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Archived from './Archived';

const Main = () => (
  <main>
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/archived" element={<Archived />} />
    </Routes>
  </main>
);

export default Main;
