import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav, NavItem } from 'reactstrap';
import SaveAndLoad from './SaveAndLoad';
import HeaderLink, { AppName } from '../stylesheets/HeaderLink';

const Header = () => (
  <header className="header row mt-3 ms-3 mb-3">
    <div className="col-md-6">
      <h1 className="title">
        <NavLink to="/">
          <AppName>
            <img style={{ width: '190px' }} src="img/logo.png"></img>
          </AppName>
        </NavLink>
      </h1>
    </div>
    <div className="col-md-6">
      <Nav className="mt-3">
        <NavItem>
          <NavLink to="/">
            <HeaderLink>Home</HeaderLink>
          </NavLink>
        </NavItem>
        <NavItem className="ms-2">
          <NavLink to="/archived">
            <HeaderLink>Archived</HeaderLink>
          </NavLink>
        </NavItem>
        <SaveAndLoad />
      </Nav>
    </div>
  </header>
);

export default Header;
