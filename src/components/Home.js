import React, { useState, useEffect } from 'react';
import * as Tmdb from '../api/Tmdb';
import ListResults from './ListResults';
import ListSeasons from './ListSeasons';
import Storage from '../Storage';
import { Button, UncontrolledCollapse } from 'reactstrap';

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

  const listShowActions = (showsArray, arrayName) => {
    return (showsArray.length === 0) ? <p>Nothing here!</p> : 
     showsArray.map((item, index) => 
      <div key={index} className="mt-2"> 
        <strong id={'toggler-'+arrayName+index} style={{cursor: 'pointer'}}>{item.name}</strong><br/>
        <UncontrolledCollapse toggler={'#toggler-'+arrayName+index}>
          <Button size="sm" color="danger" id={'remove-button-'+index} 
            onClick={(e) => removeShow(e, arrayName, item.id, index)} className="remove-button ml-1">
            Remove
          </Button>
          <Button size="sm" id={'archive-button-'+index} onClick={(e) => archiveShow(e, arrayName, item.id, index)} 
            className="archive-button ml-1">
            Archive
          </Button>
          <br/><br />
          <ListSeasons item={item} arrayName={arrayName} storedShows={storedShows} 
            setStoredShows={setStoredShows} myShows={myShows} setMyShows={setMyShows} />
        </UncontrolledCollapse>
      </div>
    )
  }

  return (
    <div className="Home row">
      <div className="col-md-2 mt-2 ml-1 border-right">
        Search for tv series below.<br/>
        <form className="App-intro" onSubmit={searchApi}>
          <input value={term} onChange={event => setTerm(event.target.value)} />
          <Button className="ml-1" color="success" className="mt-1">Submit</Button>
        </form>
        <br/>
        <ListResults storedShows={storedShows} myShows={myShows} items={items} setMyShows={setMyShows} />
      </div>
      <div className="col-md-9">
        <h2>Active Shows</h2><br/>
        { listShowActions(myShows.active, 'active') }
        <h2 className="mt-3">Finished Shows</h2><br/>
        { listShowActions(myShows.finished, 'finished') }
      </div>
    </div>
  );
}

export default Home;