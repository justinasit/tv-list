import React from 'react';
import Storage from '../Storage';
import { useSelector, useDispatch } from "react-redux";

const ListSeasons = (props) => {
  const storage = new Storage();
  const myShows = useSelector(state => state.myShows);
  const storedShows = useSelector(state => state.storedShows);
  const dispatch = useDispatch();

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
      type: "storedShows"
    });
    storage.setItem('storedShows', updatedShows);
    updateShowActivity(updatedShows, item, seasonAdded, visibility);
  }

  const updateShowActivity = (updatedShows, item, seasonAdded, visibility) => {
    if (seasonAdded) {
      if (updatedShows[item.showIdIndex].seasons_watched.length === item.number_of_seasons) {
        myShows.finished.push(item);
        dispatch({
          payload: {
            active: myShows.active.filter((show) => show.name !== item.name),
            finished: myShows.finished
          },
          type: 'myShows'
        });
      }
    } else {
      if (visibility === 'finished') {
        myShows.active.push(item);
        dispatch({
          payload: {
            active: myShows.active,
            finished: myShows.finished.filter((show) => show.name !== item.name),
          },
          type: "myShows"
        });
      }
    }
  }

  /* List seasons with checkboxes, disable checkboxes for seasons that haven't aired yet */
  return ( 
    <span>
        {Array.from(Array(props.item.number_of_seasons), (e,i)=>i+1).map(i => <span key={i}>Season {i} 
        <input defaultChecked={storedShows[props.item.showIdIndex].seasons_watched.includes(i)}
          onChange={() => checkSeason(i, props.item, props.visibility)} type="checkbox"
          disabled={i>props.item.last_aired_season} className="ml-1" id={'season-checkbox-'+props.item.id+'-'+i}
          />
        <br/></span>)}
    </span>
  )
}

export default ListSeasons;