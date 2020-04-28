import React, { useReducer } from 'react';
import Storage from '../Storage';
import { useSelector, useDispatch } from 'react-redux';
import DefaultCheckbox from '../stylesheets/DefaultCheckbox';

const ListSeasons = props => {
  const storage = new Storage();
  const myShows = useSelector(state => state.myShows);
  const storedShows = useSelector(state => state.storedShows);
  const dispatch = useDispatch();
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  /* Update the seasons watched array in storage and state */
  const checkSeason = (seasonNumber, item, visibility) => {
    const updatedShows = storedShows;
    let seasonAdded = false;
    if (storedShows[item.showIdIndex].seasons_watched.includes(seasonNumber)) {
      const seasonIndex = storedShows[item.showIdIndex].seasons_watched.indexOf(seasonNumber);
      updatedShows[item.showIdIndex].seasons_watched.splice(seasonIndex, 1);
    } else {
      updatedShows[item.showIdIndex].seasons_watched.push(seasonNumber);
      seasonAdded = true;
    }
    dispatch({
      payload: updatedShows,
      type: 'storedShows',
    });
    storage.setItem('stored-shows', updatedShows);
    updateShowActivity(updatedShows, item, seasonAdded, visibility);
    forceUpdate();
  };

  const updateShowActivity = (updatedShows, item, seasonAdded, visibility) => {
    if (seasonAdded) {
      if (updatedShows[item.showIdIndex].seasons_watched.length === item.last_aired_season) {
        myShows.finished.push(item);
        dispatch({
          payload: {
            active: myShows.active.filter(show => show.name !== item.name),
            finished: myShows.finished,
          },
          type: 'myShows',
        });
      }
    } else {
      if (visibility === 'finished') {
        myShows.active.push(item);
        dispatch({
          payload: {
            active: myShows.active,
            finished: myShows.finished.filter(show => show.name !== item.name),
          },
          type: 'myShows',
        });
      }
    }
  };

  /* List seasons with checkboxes, disable checkboxes for seasons that haven't aired yet */
  return (
    <div className="mt-2">
      {Array.from(Array(props.item.number_of_seasons), (e, i) => i + 1).map(i => (
        <span className={i % 5 !== 1 ? 'ml-3' : ''} key={i}>
          Season {i}
          <label>
            <DefaultCheckbox
              defaultChecked={storedShows[props.item.showIdIndex].seasons_watched.includes(i)}
              onChange={() => checkSeason(i, props.item, props.visibility)}
              type="checkbox"
              disabled={i > props.item.last_aired_season}
              className="ml-1"
              id={'season-checkbox-' + props.item.id + '-' + i}
            />
          </label>
          {i % 5 === 0 ? <br /> : ''}
        </span>
      ))}
    </div>
  );
};

export default ListSeasons;
