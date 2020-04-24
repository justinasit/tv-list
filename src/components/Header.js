import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav, NavItem } from 'reactstrap';

const Header = () => (
  <header className="header row row">
    <div className="col-md-6">
      <h1 className="title">Your TV List</h1>
    </div>
    <div className="col-md-6">
      <Nav>
        <NavItem>
          <NavLink exact={true} activeClassName="is-active" to="/">
            Home
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink activeClassName="is-active" to="/archived">
            Archived
          </NavLink>
        </NavItem>
      </Nav>
    </div>
  </header>
);

export default Header;
