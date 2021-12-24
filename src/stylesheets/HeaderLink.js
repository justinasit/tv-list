import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Nav } from 'reactstrap';

const HeaderLink = styled.span`
  color: #ffffff;

  &:hover {
    color: #d4d4d4;
  }
`;

export const AppName = styled.span`
  color: #ffffff;
`;

export const StyledNavLink = styled(NavLink)`
  padding-right: 8px;
  border-right: 1px solid white;
  font-size: 17px;
`;

export const StyledNav = styled(Nav)`
  @media only screen and (min-width: 768px) {
    display: inline-block;
    padding-right: 0px;
  }
  @media only screen and (max-width: 768px) {
    flex-direction: row-reverse;
    flex-basis: content;
  }
`;

export default HeaderLink;
