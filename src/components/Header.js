import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav, NavItem } from 'reactstrap';
import SaveAndLoad from './SaveAndLoad';
import HeaderLink from '../stylesheets/HeaderLink';

const Header = () => (
  <header className="header row mt-3 ml-3 mb-3">
    <div className="col-md-6">
      <h1 className="title">Your TV Tracker</h1>
    </div>
    <div className="col-md-6">
      <Nav className="mt-3">
        <NavItem>
          <NavLink exact={true} activeClassName="is-active" to="/">
            <HeaderLink>Home</HeaderLink>
          </NavLink>
        </NavItem>
        <NavItem className="ml-2">
          <NavLink activeClassName="is-active" to="/archived">
            <HeaderLink>Archived</HeaderLink>
          </NavLink>
        </NavItem>
        <SaveAndLoad />
      </Nav>
    </div>
  </header>
);

export default Header;
