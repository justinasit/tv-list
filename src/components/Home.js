import React, { useState, useEffect } from 'react';
import * as MovieApi from '../api/MovieApi';
import ListResults from './ListResults';
import ListActions from './ListActions';
import Storage from '../Storage';
import { Input } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { Heading1, Heading3 } from '../stylesheets/Headings';
import DefaultButton from '../stylesheets/DefaultButton';

const Home = () => {
  const [items, setItems] = useState([]);
  let term = '';
  const dispatch = useDispatch();

  /* Call the API to retrieve all user's stored show data.
   * Push show data from the API to either active or finished array
   */
  useEffect(() => {
    const storage = new Storage();

    const fetchData = async () => {
      const storedShows = await storage.getItem('stored-shows');

      dispatch({
        payload: storedShows,
        type: 'storedShows',
      });
      let shows = { active: [], finished: [] };
      const getShowData = (showsArray, show, apiData, showIdIndex) => {
        if (show.seasons_watched.length === apiData.last_episode_to_air.season_number) {
          showsArray.finished.push(MovieApi.mapApiDataToObject(apiData, showIdIndex, show.note));
        } else {
          showsArray.active.push(MovieApi.mapApiDataToObject(apiData, showIdIndex, show.note));
        }

        return showsArray;
      };

      storedShows.map((show, showIdIndex) =>
        MovieApi.getInfoById(show.id).then(data => {
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
    };
    fetchData();
  }, [dispatch]);

  const searchApi = event => {
    event.preventDefault();

    MovieApi.searchTv(term).then(data => {
      setItems(data.results);
      term = '';
    });
  };

  return (
    <div className="Home row">
      <div className="col-md-2 mt-2 ml-1 border-right">
        Search for tv series below to add it to your list.
        <br />
        <br />
        <form className="App-intro" onSubmit={searchApi}>
          <Input placeholder="Search" onChange={event => (term = event.target.value)} />
          <DefaultButton className="ml-1 mt-1">Submit</DefaultButton>
        </form>
        <br />
        <ListResults items={items} />
      </div>
      <div className="col-md-9">
        <Heading1>Active Shows</Heading1>
        <Heading3>These are the shows that have new episodes available.</Heading3>
        <br />
        <ListActions visibility="active" />
        <Heading1 className="mt-3">Finished Shows</Heading1>
        <Heading3>These are the shows that you have finished watching.</Heading3>
        <br />
        <ListActions visibility="finished" />
      </div>
    </div>
  );
};

export default Home;
