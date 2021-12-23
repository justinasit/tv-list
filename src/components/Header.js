import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav, NavItem } from 'reactstrap';
import SaveAndLoad from './SaveAndLoad';
import HeaderLink, { StyledNavLink, AppName } from '../stylesheets/HeaderLink';

const Header = () => (
  <header className="row mt-3 mb-3">
    <ul className="navbar-nav mb-2 col-md-2 ms-1 pe-4">
      <li className="nav-item">
        <NavLink to="/">
          <AppName>
            <img style={{ width: '190px' }} src="img/logo.png"></img>
          </AppName>
        </NavLink>
      </li>
    </ul>
    <Nav className="mt-3 col-md-9 ps-4" style={{ display: 'inline-block', paddingRight: '0px' }}>
      <SaveAndLoad />
      <NavItem className="ms-2" style={{ float: 'right' }}>
        <StyledNavLink to="/archived">
          <HeaderLink>Archived</HeaderLink>
        </StyledNavLink>
      </NavItem>
      <NavItem className="ms-2" style={{ float: 'right' }}>
        <StyledNavLink to="/">
          <HeaderLink>Home</HeaderLink>
        </StyledNavLink>
      </NavItem>
    </Nav>
  </header>
);

export default Header;
