import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, NavItem } from 'reactstrap';

const Header = () => (
  <header className="header">
    <h1 className="title">Your TV List</h1>
    <p>You can store a list of TV series you watch using this app!</p>
    <Nav>
      <NavItem>
        <Link to='/'>Home</Link>
      </NavItem>
      <NavItem>
        <Link to='/archived'>Archived</Link>
      </NavItem>
    </Nav>
  </header>
  )
  
  export default Header;