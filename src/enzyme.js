import React from 'react';
import Enzyme, { configure, shallow, mount, render } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

configure({ adapter: new Adapter() });
React.useLayoutEffect = React.useEffect;

export { shallow, mount, render };

export default Enzyme;
