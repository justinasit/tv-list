import styled from 'styled-components';

const DefaultButton = styled.button`
  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0;
  color: #fff;
  background-color: #2f3c48;
  border-color: white;
  &:hover {
    background-color: #343131;
  }
`;

export default DefaultButton;
