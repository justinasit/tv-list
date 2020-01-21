import React, { useState, useEffect } from 'react';
import * as Tmdb from '../api/Tmdb';
import ListResults from './ListResults';
import ListActions from './ListActions';
import Storage from '../Storage';
import { Button } from 'reactstrap';
import { useDispatch } from 'react-redux';

const Home = () => {
  const [items, setItems] = useState([]);
  let term = '';
  const dispatch = useDispatch();

  /* Call the API to retrieve all user's stored show data.
   * Push show data from the API to either active or finished array
   */
  useEffect(() => {
    const storage = new Storage();
    const storedShows = storage.getItem('storedShows') ? storage.getItem('storedShows') : [];
    dispatch({
      payload: storedShows,
      type: 'storedShows',
    });
    let shows = { active: [], finished: [] };
    const getShowData = (showsArray, show, apiData, showIdIndex) => {
      if (show.seasons_watched.length === apiData.last_episode_to_air.season_number) {
        showsArray.finished.push(mapApiDataToObject(apiData, showIdIndex, show.note));
      } else {
        showsArray.active.push(mapApiDataToObject(apiData, showIdIndex, show.note));
      }

      return showsArray;
    };

    storedShows.map((show, showIdIndex) =>
      Tmdb.getInfoById(show.id).then(data => {
        shows = getShowData(shows, show, data, showIdIndex);
        // Only change state on last element
        if (shows.finished.length + shows.active.length === storedShows.length) {
          dispatch({
            payload: shows,
            type: 'myShows',
          });
        }
      }),
    );
  }, [dispatch]);

  /* Map show data from the API to our shows object */
  const mapApiDataToObject = (apiData, showIdIndex, note) => {
    return {
      name: apiData.name,
      number_of_seasons: apiData.number_of_seasons,
      last_aired_season: apiData.last_episode_to_air.season_number,
      showIdIndex: showIdIndex,
      id: apiData.id,
      note: note,
    };
  };

  const searchApi = event => {
    event.preventDefault();

    Tmdb.searchTv(term).then(data => {
      setItems(data.results);
      term = '';
    });
  };

  return (
    <div className="Home row">
      <div className="col-md-2 mt-2 ml-1 border-right">
        Search for tv series below.
        <br />
        <form className="App-intro" onSubmit={searchApi}>
          <input onChange={event => (term = event.target.value)} />
          <Button className="ml-1 mt-1" color="success">
            Submit
          </Button>
        </form>
        <br />
        <ListResults items={items} />
      </div>
      <div className="col-md-9">
        <h2>Active Shows</h2>
        <br />
        <ListActions visibility="active" />
        <h2 className="mt-3">Finished Shows</h2>
        <br />
        <ListActions visibility="finished" />
      </div>
    </div>
  );
};

export default Home;
