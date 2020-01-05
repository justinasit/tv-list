import React, { useState, useEffect } from 'react';
import * as Tmdb from '../api/Tmdb';
import ListResults from './ListResults';
import Storage from '../Storage';
import { Button } from 'reactstrap';

const Home = () => {
  const storage = new Storage();
  const [term, setTerm] = useState('');
  const [items, setItems] = useState([]);
  const [storedShows, setStoredShows] = useState(storage.getItem('storedShows') ? storage.getItem('storedShows') : []);
  const [myShows, setMyShows] = useState({active: [], finished: []});
  
  /* Call the API to retrieve all user's stored show data.
   * Push show data from the API to either active or finished array 
   */
  useEffect(() => {
    let shows = {active: [], finished: []};
    const getShowData = (showsArray, show, apiData, showIdIndex) => {
      if (Math.max(...show.seasons_watched) === apiData.last_episode_to_air.season_number) {
        showsArray.finished.push(mapApiDataToObject(apiData, showIdIndex));
      } else {
        showsArray.active.push(mapApiDataToObject(apiData, showIdIndex));
      }
  
      return showsArray;
    }
    
    storedShows.map((show, showIdIndex) => 
      Tmdb.getInfoById(show.id).then(data => {
        shows = getShowData(shows, show, data, showIdIndex);
        // Only change state on last element
        if ((shows.finished.length + shows.active.length) === storedShows.length) {
          setMyShows(shows);
        }
      })
    );
  }, [storedShows]);

  /* Map show data from the API to our shows object */
  const mapApiDataToObject = (apiData, showIdIndex) => {
    return {name: apiData.name, number_of_seasons: apiData.number_of_seasons, 
      last_aired_season: apiData.last_episode_to_air.season_number, showIdIndex: showIdIndex, id: apiData.id};
  }

  const searchApi = (event) => {
    event.preventDefault();

    Tmdb.searchTv(term).then(data => {
      setItems(data.results);
      setTerm('');
    });
  }

  /* List seasons with checkboxes, disable checkboxes for seasons that haven't aired yet */
  const listSeasons = (numberOfSeasons, showIndex, lastAiredSeason) => {
    return <span>{Array.from(Array(numberOfSeasons), (e,i)=>i+1).map(i => <span key={i}>Season {i} 
      <input defaultChecked={storedShows[showIndex].seasons_watched.includes(i)}
        onChange={() => checkSeason(i, showIndex)} type="checkbox"
        disabled={i>lastAiredSeason}
        />
      <br/></span>)}</span>
  }

  /* Update the seasons watched array in storage and state */
  const checkSeason = (seasonNumber, showIndex) => {
    const updatedShows = storedShows;
    if (storedShows[showIndex].seasons_watched.includes(seasonNumber)) {
      const seasonIndex = storedShows[showIndex].seasons_watched.indexOf(seasonNumber);
      updatedShows[showIndex].seasons_watched.splice(seasonIndex, 1);
    } else {
      updatedShows[showIndex].seasons_watched.push(seasonNumber);
    }
    setStoredShows(updatedShows);
    storage.setItem('storedShows', updatedShows);
  }

  const removeShow = (e, arrayKey, id, index) => {
    e.preventDefault();
    const showsWithoutRemovedItem = myShows[arrayKey].filter((show, key) => key !== index);
    setMyShows({
      active: arrayKey === 'active' ? showsWithoutRemovedItem : myShows.active,
      finished: arrayKey === 'finished' ? showsWithoutRemovedItem : myShows.finished,
    });
    storage.setItem('storedShows', storedShows.filter(show => id !== show.id));
  }

  const archiveShow = (e, arrayKey, id, index) => {
    const archivedShows = storage.getItem('archivedShows') ? storage.getItem('archivedShows') : [];
    archivedShows.push(myShows[arrayKey][index]);
    storage.setItem('archivedShows', archivedShows);
    removeShow(e, arrayKey, id, index);
  }

  return (
    <div className="Home">
      <h2>Active Shows</h2><br/>
      { (myShows.active.length === 0) ? <p>Nothing here!</p> : ''}
      { myShows.active.map((item, index) => 
          <p key={index}> 
            <li>{item.name}
            <Button size="sm" color="danger" id={'remove-button-'+index} onClick={(e) => removeShow(e, 'active', item.id, index)} className="remove-button">Remove</Button>
            <Button size="sm" id={'archive-button-'+index} onClick={(e) => archiveShow(e, 'active', item.id, index)} className="archive-button">Archive</Button>
              <br/><br />
              { listSeasons(item.number_of_seasons, item.showIdIndex, item.last_aired_season) }
            </li>
      </p>)}
      <h2>Finished Shows</h2><br/>
      { (myShows.finished.length === 0) ? <p>Nothing here!</p> : ''}
      { myShows.finished.map((item, index) => 
          <p key={index}> 
            <li>{item.name} 
            <Button size="sm" color="danger" onClick={(e) => removeShow(e, 'finished', item.id, index)} className="remove-button">Remove</Button>
            <Button size="sm" id={'archive-button-'+index} onClick={(e) => archiveShow(e, 'finished', item.id, index)} className="archive-button">Archive</Button>
              <br/><br />
              { listSeasons(item.number_of_seasons, item.showIdIndex, item.last_aired_season) }
            </li>
      </p>)}
      Search for tv series below.<br/>
      <form className="App-intro" onSubmit={searchApi}>
        <input value={term} onChange={event => setTerm(event.target.value)} />
        <Button color="success">Submit</Button>
      </form>
      <br/>
      <ListResults storedShows={storedShows} myShows={myShows} items={items} setMyShows={setMyShows} />
    </div>
  );
}

export default Home;