import React, { useState, useEffect } from 'react';
import * as MovieApi from '../api/MovieApi';
import ListResults from './ListResults';
import ListActions from './ListActions';
import Storage from '../Storage';
import { Input } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Heading1, Heading3 } from '../stylesheets/Headings';
import DefaultButton from '../stylesheets/DefaultButton';

const Home = () => {
  const [items, setItems] = useState([]);
  let term = '';
  const dispatch = useDispatch();
  const myShows = useSelector(state => state.myShows);

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

  const showEmptyState = () => {
    if (typeof myShows.active === 'undefined') {
      return (
        <div>
          <h2>Welcome!</h2>
          <br />
          This application allows you to find any of your favourite TV series. <br />
          It is useful for tracking releases of new seasons and marking off the ones you watched.
          <br />
          Once you mark off all seasons as watched, the series will move to the "Finished" category.
          <br />
          Finished shows will automatically move back to "Active" once a new season of a show has
          been released.
          <br />
          This way you will automatically know which series has new seasons just by visiting this
          page. <br />
          Get started by using the search box on the left hand side of the page!
          <br />
          <br />
        </div>
      );
    }
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
        {showEmptyState()}
        <Heading1 className="ml-2 ml-md-0">Active Shows</Heading1>
        <Heading3 className="ml-2 ml-md-0">
          These are the shows that have new episodes available.
        </Heading3>
        <br />
        <ListActions visibility="active" />
        <Heading1 className="mt-3 ml-2 ml-md-0">Finished Shows</Heading1>
        <Heading3 className="ml-2 ml-md-0">
          These are the shows that you have finished watching.
        </Heading3>
        <br />
        <ListActions visibility="finished" />
      </div>
    </div>
  );
};

export default Home;
