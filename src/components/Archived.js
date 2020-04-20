import React, { useState, useEffect } from 'react';
import Storage from '../Storage';
import { Button } from 'reactstrap';

const Archived = () => {
  const storage = new Storage();
  const [archivedShows, setArchivedShows] = useState([]);

  useEffect(() => {
    const storage = new Storage();

    const fetchData = async () => {
      setArchivedShows(await storage.getItem('archived-shows'));
    };
    fetchData();
  }, []);

  const unArchiveShow = async (id, index) => {
    const storedShows = await storage.getItem('stored-shows');
    storedShows.push({ id: id, seasons_watched: [] });
    storage.setItem('stored-shows', storedShows);

    const showsWithoutRemovedItem = archivedShows.filter((show, key) => key !== index);
    setArchivedShows(showsWithoutRemovedItem);
    storage.setItem('archived-shows', showsWithoutRemovedItem);
  };

  return (
    <div>
      <h2>Archived Shows</h2>
      <br />
      {archivedShows.length === 0 ? <p>Nothing here!</p> : ''}
      {archivedShows.map((item, index) => (
        <p key={index}>
          <li>
            {`${item.name} (Seasons - ${item.number_of_seasons})`}
            <br />
            <Button
              size="sm"
              id={'unarchive-button-' + index}
              onClick={() => unArchiveShow(item.id, index)}
            >
              Un-Archive
            </Button>
            <br />
            <br />
          </li>
        </p>
      ))}
    </div>
  );
};

export default Archived;
