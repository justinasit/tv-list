import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

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

export default HeaderLink;
