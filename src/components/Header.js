import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav, NavItem } from 'reactstrap';

const Header = () => (
  <header className="header">
    <h1 className="title">Your TV List</h1>
    <p>You can store a list of TV series you watch using this app!</p>
    <Nav>
      <NavItem>
        <NavLink exact={true} activeClassName='is-active' to='/'>Home</NavLink>
      </NavItem>
      <NavItem>
        <NavLink activeClassName='is-active' to='/archived'>Archived</NavLink>
      </NavItem>
    </Nav>
  </header>
  )
  
  export default Header;