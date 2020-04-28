import React, { useState, useRef } from 'react';
import Storage from '../Storage';
import ListSeasons from './ListSeasons';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import DefaultButton from '../stylesheets/DefaultButton';
import { Heading2, Heading3 } from '../stylesheets/Headings';

const SingleShow = styled.div`
  border-bottom: 1px solid grey;
`;

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
      'stored-shows',
      storedShows.filter(show => id !== show.id),
    );
  };

  const archiveShow = async (e, visibility, id, index) => {
    const archivedShows = await storage.getItem('archived-shows');
    archivedShows.push(myShows[visibility][index]);
    storage.setItem('archived-shows', archivedShows);
    removeShow(e, visibility, id, index);
  };

  const showNote = note => (note ? <Heading3>{note}</Heading3> : '');

  const addNote = e => {
    e.preventDefault();
    storedShows[activeItem.current.showIdIndex].note = note;
    dispatch({
      payload: storedShows,
      type: 'stored-shows',
    });
    storage.setItem('stored-shows', storedShows);
    setModal(false);
  };

  const toggleModal = (e, item) => {
    e.preventDefault();
    if (!modal) activeItem.current = item;
    setModal(!modal);
  };

  return !myShows[props.visibility] || myShows[props.visibility].length === 0 ? (
    <p id="empty">Nothing here!</p>
  ) : (
    myShows[props.visibility].map((item, index) => (
      <SingleShow key={index} className="mt-2 row pb-1">
        <div className="col-md-3">
          <img className="col-md-8" src={item.poster} alt="poster" />
        </div>
        <div className="col-md-9">
          <Heading2>{item.name}</Heading2>
          {showNote(storedShows[item.showIdIndex].note)}
          <ListSeasons item={item} visibility={props.visibility} />
          <br />
          <DefaultButton
            id={'remove-button-' + index}
            onClick={e => removeShow(e, props.visibility, item.id, index)}
            className="remove-button mr-2"
          >
            Remove
          </DefaultButton>
          <DefaultButton
            id={'archive-button-' + index}
            onClick={e => archiveShow(e, props.visibility, item.id, index)}
            className="archive-button mr-2"
          >
            Archive
          </DefaultButton>
          <DefaultButton
            id={'add-note-' + index}
            onClick={e => toggleModal(e, item)}
            className="mr-2"
          >
            Add Note
          </DefaultButton>
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
              <Button id="submit-note" color="primary" onClick={e => addNote(e)}>
                Submit
              </Button>{' '}
              <Button color="secondary" onClick={toggleModal}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </SingleShow>
    ))
  );
};

export default ListActions;
