import React from 'react';
import Storage from '../Storage';
import ListSeasons from './ListSeasons';
import { Button, UncontrolledCollapse } from 'reactstrap';
import { useSelector, useDispatch } from "react-redux";

const ListActions = (props) => {
  const storage = new Storage();
  const myShows = useSelector(state => state.myShows);
  const dispatch = useDispatch();

  const removeShow = (e, visibility, id, index) => {
    e.preventDefault();
    const showsWithoutRemovedItem = myShows[visibility].filter((show, key) => key !== index);
    dispatch({
      payload: {
        active: visibility === 'active' ? showsWithoutRemovedItem : myShows.active,
        finished: visibility === 'finished' ? showsWithoutRemovedItem : myShows.finished,
      },
      type: 'myShows'
    });
    storage.setItem('storedShows', props.storedShows.filter(show => id !== show.id));
  }

  const archiveShow = (e, visibility, id, index) => {
    const archivedShows = storage.getItem('archivedShows') ? storage.getItem('archivedShows') : [];
    archivedShows.push(myShows[visibility][index]);
    storage.setItem('archivedShows', archivedShows);
    removeShow(e, visibility, id, index);
  }

  return ( 
    (!myShows || myShows[props.visibility].length === 0) ? <p>Nothing here!</p> : 
    myShows[props.visibility].map((item, index) => 
    <div key={index} className="mt-2"> 
      <strong id={'toggler-'+props.visibility+index} style={{cursor: 'pointer'}}>{item.name}</strong><br/>
      <UncontrolledCollapse toggler={'#toggler-'+props.visibility+index}>
        <Button size="sm" color="danger" id={'remove-button-'+index} 
          onClick={(e) => removeShow(e, props.visibility, item.id, index)} className="remove-button ml-1">
          Remove
        </Button>
        <Button size="sm" id={'archive-button-'+index} onClick={(e) => archiveShow(e, props.visibility, item.id, index)} 
          className="archive-button ml-1">
          Archive
        </Button>
        <br/><br />
        <ListSeasons item={item} visibility={props.visibility} storedShows={props.storedShows} 
          setStoredShows={props.setStoredShows} />
      </UncontrolledCollapse>
    </div>
    )
  )
}

export default ListActions;