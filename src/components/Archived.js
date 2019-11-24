import React, { useState } from 'react';
import Storage from '../Storage';
import { Button } from 'reactstrap';

const Archived = () => {
  const storage = new Storage();
  const [archivedShows, setArchivedShows] = useState(storage.getItem('archivedShows') ? storage.getItem('archivedShows') : []);

  const unArchiveShow = (id, index) => {
    const storedShows = storage.getItem('storedShows');
    storedShows.push({id: id, seasons_watched: []});
    storage.setItem('storedShows', storedShows);
    
    const showsWithoutRemovedItem = archivedShows.filter((show, key) => key !== index);
    setArchivedShows(showsWithoutRemovedItem);
    storage.setItem('archivedShows', showsWithoutRemovedItem);
  }

  return ( 
    <div>
      <h2>Archived Shows</h2><br/>
      { (archivedShows.length === 0) ? <p>Nothing here!</p> : ''}
      { archivedShows.map((item, index) => 
          <p key={index}> 
            <li>{`${item.name} (Seasons - ${item.number_of_seasons})`} 
            <Button size="sm" id={'unarchive-button-'+index} onClick={(e) => unArchiveShow(item.id, index)}>Un-Archive</Button>
              <br/><br />  
            </li>
      </p>)}
    </div>
  )
}

export default Archived;