import React, { useState, useEffect } from 'react';
import Storage from '../Storage';
import { Heading1 } from '../stylesheets/Headings';
import DefaultButton from '../stylesheets/DefaultButton';
import { ListGroup } from 'reactstrap';
import styled from 'styled-components';

const SingleArchivedShow = styled.li`
  list-style-type: none;
`;

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
    <div className="ms-3">
      <Heading1>Archived Shows</Heading1>
      {`You can find a list of shows here that you decided to archive if you're no longer interested
      in them.`}
      <br />
      <br />
      {archivedShows.length === 0 ? <p>Nothing here yet!</p> : ''}
      {archivedShows.map((item, index) => (
        <ListGroup key={index}>
          <SingleArchivedShow>
            {`${item.name} (${item.number_of_seasons} Seasons)`}
            <DefaultButton
              className="ms-3"
              id={'unarchive-button-' + index}
              onClick={() => unArchiveShow(item.id, index)}
            >
              Unarchive
            </DefaultButton>
          </SingleArchivedShow>
          <br />
        </ListGroup>
      ))}
    </div>
  );
};

export default Archived;
