import React from 'react';
import styled, { css } from 'styled-components';

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const Icon = styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 4px;
`;

const disabledStyles = css`
  background: #ecb2b2;
`;

const StyledCheckbox = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  line-height: 0.7;
  margin-bottom: 8px;
  background: ${props => (props.defaultChecked ? '#2f3c48' : '#dee2e6')};
  border-radius: 3px;
  transition: all 150ms;

  ${HiddenCheckbox}:focus + & {
    box-shadow: 0 0 0 3px #2f3c48;
  }
  ${Icon} {
    visibility: ${props => (props.defaultChecked ? 'visible' : 'hidden')};
  }

  ${props => (props.disabled ? disabledStyles : ``)};
`;

const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
`;
const DefaultCheckbox = ({ className, ...props }) => {
  return (
    <CheckboxContainer className={className} id={props.id}>
      <HiddenCheckbox {...props} />
      <StyledCheckbox defaultChecked={props.defaultChecked} disabled={props.disabled}>
        <Icon viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </Icon>
      </StyledCheckbox>
    </CheckboxContainer>
  );
};

export default DefaultCheckbox;
