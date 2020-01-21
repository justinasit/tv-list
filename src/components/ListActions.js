import React, { useState, useRef } from 'react';
import Storage from '../Storage';
import ListSeasons from './ListSeasons';
import {
  Button,
  UncontrolledCollapse,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';

const ListActions = props => {
  const storage = new Storage();
  const myShows = useSelector(state => state.myShows);
  const storedShows = useSelector(state => state.storedShows);
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  let note = '';
  const activeItem = useRef(0);

  const removeShow = (e, visibility, id, index) => {
    e.preventDefault();
    const showsWithoutRemovedItem = myShows[visibility].filter((show, key) => key !== index);
    dispatch({
      payload: {
        active: visibility === 'active' ? showsWithoutRemovedItem : myShows.active,
        finished: visibility === 'finished' ? showsWithoutRemovedItem : myShows.finished,
      },
      type: 'myShows',
    });
    storage.setItem(
      'storedShows',
      storedShows.filter(show => id !== show.id),
    );
  };

  const archiveShow = (e, visibility, id, index) => {
    const archivedShows = storage.getItem('archivedShows') ? storage.getItem('archivedShows') : [];
    archivedShows.push(myShows[visibility][index]);
    storage.setItem('archivedShows', archivedShows);
    removeShow(e, visibility, id, index);
  };

  const showNote = note => {
    return note ? note : '';
  };

  const addNote = e => {
    e.preventDefault();
    storedShows[activeItem.current.showIdIndex].note = note;
    dispatch({
      payload: storedShows,
      type: 'storedShows',
    });
    storage.setItem('storedShows', storedShows);
    setModal(false);
  };

  const toggleModal = (e, item) => {
    e.preventDefault();
    if (!modal) activeItem.current = item;
    setModal(!modal);
  };

  return !myShows[props.visibility] || myShows[props.visibility].length === 0 ? (
    <p>Nothing here!</p>
  ) : (
    myShows[props.visibility].map((item, index) => (
      <div key={index} className="mt-2">
        <strong id={'toggler-' + props.visibility + index} style={{ cursor: 'pointer' }}>
          {item.name}
        </strong>
        <br />
        {showNote(storedShows[item.showIdIndex].note)}
        <UncontrolledCollapse toggler={'#toggler-' + props.visibility + index}>
          <Button
            size="sm"
            color="danger"
            id={'remove-button-' + index}
            onClick={e => removeShow(e, props.visibility, item.id, index)}
            className="remove-button ml-1"
          >
            Remove
          </Button>
          <Button
            size="sm"
            id={'archive-button-' + index}
            onClick={e => archiveShow(e, props.visibility, item.id, index)}
            className="archive-button ml-1"
          >
            Archive
          </Button>
          <Button size="sm" onClick={e => toggleModal(e, item)} className="ml-1" color="info">
            Add Note
          </Button>
          <Modal isOpen={modal} toggle={toggleModal}>
            <ModalHeader>Add Note</ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup>
                  <Input
                    defaultValue={activeItem.current.note}
                    placeholder="Your Note"
                    onChange={event => (note = event.target.value)}
                  />
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={e => addNote(e)}>
                Submit
              </Button>{' '}
              <Button color="secondary" onClick={toggleModal}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
          <br />
          <br />
          <ListSeasons item={item} visibility={props.visibility} />
        </UncontrolledCollapse>
      </div>
    ))
  );
};

export default ListActions;
