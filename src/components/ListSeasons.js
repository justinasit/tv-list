import React from 'react';
import Storage from '../Storage';

const ListSeasons = (props) => {
  const storage = new Storage();

  /* Update the seasons watched array in storage and state */
  const checkSeason = (seasonNumber, item, visibility) => {
    const updatedShows = props.storedShows;
    let seasonAdded = false;
    if (props.storedShows[item.showIdIndex].seasons_watched.includes(seasonNumber)) {
        const seasonIndex = props.storedShows[item.showIdIndex].seasons_watched.indexOf(seasonNumber);
        updatedShows[item.showIdIndex].seasons_watched.splice(seasonIndex, 1);
    } else {
        updatedShows[item.showIdIndex].seasons_watched.push(seasonNumber);
        seasonAdded = true;
    }
    props.setStoredShows(updatedShows);
    storage.setItem('storedShows', updatedShows);
    updateShowActivity(updatedShows, item, seasonAdded, visibility);
  }

  const updateShowActivity = (updatedShows, item, seasonAdded, visibility) => {
    if (seasonAdded) {
      if (updatedShows[item.showIdIndex].seasons_watched.length === updatedShows[item.showIdIndex].number_of_seasons) {
        props.myShows.finished.push(item);
        props.setMyShows({
          active: props.myShows.active.filter((show) => show.name !== item.name),
          finished: props.myShows.finished
        });
      }
    } else {
      if (visibility === 'finished') {
        props.myShows.active.push(item);
        props.setMyShows({
          active: props.myShows.active,
          finished: props.myShows.finished.filter((show) => show.name !== item.name),
        });
      }
    }
  }

  /* List seasons with checkboxes, disable checkboxes for seasons that haven't aired yet */
  return ( 
    <span>
        {Array.from(Array(props.item.number_of_seasons), (e,i)=>i+1).map(i => <span key={i}>Season {i} 
        <input defaultChecked={props.storedShows[props.item.showIdIndex].seasons_watched.includes(i)}
          onChange={() => checkSeason(i, props.item, props.visibility)} type="checkbox"
          disabled={i>props.item.last_aired_season} className="ml-1"
          />
        <br/></span>)}
    </span>
  )
}

export default ListSeasons;