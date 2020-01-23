import React from 'react';
import { shallow, mount, render } from '../../enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import ListActions from '../ListActions';

describe('Our test suite', () => {
  const initialState = {
    myShows: {
      active: [
        {
          name: 'The Blacklist',
          number_of_seasons: 7,
          last_aired_season: 7,
          showIdIndex: 0,
          id: 46952,
          note: '',
        },
        {
          name: 'The Good Place',
          number_of_seasons: 4,
          last_aired_season: 4,
          showIdIndex: 1,
          id: 66573,
        },
      ],
      finished: [],
    },
    storedShows: [
      { id: 46952, seasons_watched: [1, 2, 3, 4, 5, 6], note: '' },
      { id: 66573, seasons_watched: [1, 2, 3] },
    ],
  };

  const mockStore = configureStore();
  let store, wrapper;

  beforeEach(() => {
    store = mockStore(initialState);
    wrapper = mount(
      <Provider store={store}>
        <ListActions visibility="active" />
      </Provider>,
    );
  });

  it('renders all mocked shows', () => {
    expect(wrapper.find('#empty').exists()).toBe(false);
    expect(wrapper.find('#toggler-active0').text()).toEqual('The Blacklist');
    expect(wrapper.find('#toggler-active1').text()).toEqual('The Good Place');
  });

  it('renders no shows', () => {
    const initialState = { myShows: { active: [], finished: [] } };
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <ListActions visibility="active" />
      </Provider>,
    );
    expect(wrapper.find('#empty').exists()).toBe(true);
  });
});
