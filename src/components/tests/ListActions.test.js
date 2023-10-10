import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import ListActions from '../ListActions';
import {render} from '@testing-library/react'

describe('ListActions test suite', () => {
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
  let wrapper;

  beforeEach(() => {
    wrapper = initialiseComponent();
  });

  const initialiseComponent = state => {
    const store = mockStore(state ? state : initialState);
    const div = document.createElement('div');
    div.setAttribute('id', 'show-active0');
    document.body.appendChild(div);

    return render(
      <Provider store={store}>
        <ListActions visibility="active" />
      </Provider>,
      { attachTo: div },
    );
  };

  it('renders all mocked shows', () => {
    expect(wrapper.container.querySelector('empty-active')).toBeNull();
    expect(wrapper.container.querySelector('#show-active0 h2')).toHaveTextContent('The Blacklist');
    expect(wrapper.container.querySelector('#show-active1 h2')).toHaveTextContent('The Good Place');
  });

  it('renders no shows', async () => {
    const wrapper = initialiseComponent({ myShows: { active: [], finished: [] } });
    expect(wrapper.container.querySelector('#empty-active')).toBeVisible();
  });
});
