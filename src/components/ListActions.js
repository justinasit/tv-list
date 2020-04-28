import React, { useState, useRef } from 'react';
import Storage from '../Storage';
import ListSeasons from './ListSeasons';
import { Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import DefaultButton from '../stylesheets/DefaultButton';
import { Heading2, Heading3 } from '../stylesheets/Headings';

//Only show border on non-first element of the lists
const SingleShow = styled.div`
  border-top: ${props => (props.index ? '1px solid grey;' : 'none')};
`;

const ListActions = props => {
  const storage = new Storage();
  const myShows = useSelector(state => state.myShows);
  const storedShows = useSelector(state => state.storedShows);
  const dispatch = useDispatch();
  const [noteModal, setNoteModal] = useState(false);
  const [archiveModal, setArchiveModal] = useState(false);
  const [removeModal, setRemoveModal] = useState(false);
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
    setRemoveModal(false);
  };

  const archiveShow = async (e, visibility, id, index) => {
    const archivedShows = await storage.getItem('archived-shows');
    archivedShows.push(myShows[visibility][index]);
    storage.setItem('archived-shows', archivedShows);
    removeShow(e, visibility, id, index);
    setArchiveModal(false);
  };

  const showNote = note => (note ? <Heading3>{note}</Heading3> : '');

  const showDateOfNextEpisode = date => {
    if (date) {
      return <Heading3>Date of next episode: {date}</Heading3>;
    }
  };

  const showInProduction = inProduction => {
    if (!inProduction) {
      return <Heading3>This show has now finished airing and is no longer in production.</Heading3>;
    }
  };

  const addNote = e => {
    e.preventDefault();
    storedShows[activeItem.current.showIdIndex].note = note;
    dispatch({
      payload: storedShows,
      type: 'stored-shows',
    });
    storage.setItem('stored-shows', storedShows);
    activeItem.current.note = note;
    setNoteModal(false);
  };

  const toggleNoteModal = (e, item) => {
    e.preventDefault();
    if (!noteModal) activeItem.current = item;
    setNoteModal(!noteModal);
  };

  const toggleRemoveModal = () => {
    setRemoveModal(!removeModal);
  };

  const toggleArchiveModal = () => {
    setArchiveModal(!archiveModal);
  };

  return !myShows[props.visibility] || myShows[props.visibility].length === 0 ? (
    <p id="empty">Nothing here!</p>
  ) : (
    myShows[props.visibility].map((item, index) => (
      <SingleShow key={index} index={index} className={'mt-2 row pt-2'}>
        <div className="col-md-3">
          <img className="col-md-8" src={item.poster} alt="poster" />
        </div>
        <div className="col-md-9">
          <Heading2>{item.name}</Heading2>
          {showNote(storedShows[item.showIdIndex].note)}
          {showDateOfNextEpisode(item.date_of_next_episode)}
          {showInProduction(item.in_production)}
          <ListSeasons item={item} visibility={props.visibility} />
          <br />
          <DefaultButton
            id={'remove-button-' + index}
            onClick={e => toggleRemoveModal(e)}
            className="remove-button mr-2"
          >
            Remove
          </DefaultButton>
          <DefaultButton
            id={'archive-button-' + index}
            onClick={e => toggleArchiveModal(e)}
            className="archive-button mr-2"
          >
            Archive
          </DefaultButton>
          <DefaultButton
            id={'add-note-' + index}
            onClick={e => toggleNoteModal(e, item)}
            className="mr-2"
          >
            Add Note
          </DefaultButton>

          {/* Modals */}
          <Modal isOpen={noteModal} toggle={toggleNoteModal}>
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
              <DefaultButton id="submit-note" onClick={e => addNote(e)}>
                Submit
              </DefaultButton>{' '}
              <DefaultButton onClick={toggleNoteModal}>Cancel</DefaultButton>
            </ModalFooter>
          </Modal>
          <Modal isOpen={removeModal} toggle={toggleRemoveModal}>
            <ModalHeader>Remove Show</ModalHeader>
            <ModalBody>Are you sure you want to remove this show?</ModalBody>
            <ModalFooter>
              <DefaultButton
                id="confirm-remove-show"
                onClick={e => removeShow(e, props.visibility, item.id, index)}
              >
                Submit
              </DefaultButton>
              <DefaultButton onClick={toggleRemoveModal}>Cancel</DefaultButton>
            </ModalFooter>
          </Modal>
          <Modal isOpen={archiveModal} toggle={toggleArchiveModal}>
            <ModalHeader>Archive Show</ModalHeader>
            <ModalBody>
              Are you sure you want to archive this show?
              <br />
              It will still be visible in the archived page.
            </ModalBody>
            <ModalFooter>
              <DefaultButton
                id="confirm-archive-show"
                onClick={e => archiveShow(e, props.visibility, item.id, index)}
              >
                Submit
              </DefaultButton>
              <DefaultButton onClick={toggleArchiveModal}>Cancel</DefaultButton>
            </ModalFooter>
          </Modal>
        </div>
      </SingleShow>
    ))
  );
};

export default ListActions;
