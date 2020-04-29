import React from 'react';
import * as MovieApi from '../api/MovieApi';
import Storage from '../Storage';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

const ListItem = styled.li`
  padding: 0.75rem 1.25rem;
  background-color: #303030;
  border: 1px solid #444;
  cursor: pointer;
`;

const SingleResult = ({ className, ...props }) => {
  return (
    <span className={className}>
      <ListItem
        className="d-flex justify-content-between align-items-center"
        id={'add-show-button-' + props.index}
        onClick={() => props.addShowCheck(props.item.id)}
      >
        {props.item.original_name}
      </ListItem>
    </span>
  );
};

const ListResults = props => {
  const storage = new Storage();
  const myShows = useSelector(state => state.myShows);
  const storedShows = useSelector(state => state.storedShows);
  const dispatch = useDispatch();

  /* If the show is already stored - no need to add it again */
  const addShowCheck = id => {
    if (!storedShows.map(show => show.id).includes(id)) {
      addShow(id);
    }
  };

  /* Add show id and season number to storage, update the state with show details */
  const addShow = id => {
    MovieApi.getInfoById(id).then(data => {
      if (MovieApi.hasSeasons(data)) {
        storedShows.push({ id: id, seasons_watched: [] });
        storage.setItem('stored-shows', storedShows);
        dispatch({
          payload: {
            active: [
              ...(myShows.active ? myShows.active : []),
              MovieApi.mapApiDataToObject(data, storedShows.length - 1),
            ],
            finished: myShows.finished ? myShows.finished : [],
          },
          type: 'myShows',
        });
      } else {
        alert('Sorry, this show does not have a season number provided!');
      }
    });
  };

  const getFoundString = () => {
    if (props.items.length)
      return (
        <p>
          Click on the show below that you want to add:
          <br />
        </p>
      );
  };

  return (
    <span>
      {getFoundString()}
      {props.items.map((item, index) => (
        <p key={index}>
          <SingleResult index={index} item={item} addShowCheck={addShowCheck}></SingleResult>
        </p>
      ))}
    </span>
  );
};

export default ListResults;
