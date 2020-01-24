import React from 'react';
import Enzyme, { configure, shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
React.useLayoutEffect = React.useEffect;

export { shallow, mount, render };

export default Enzyme;
