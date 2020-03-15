import React, { useState } from 'react';
import Storage from '../Storage';
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
import { useSelector } from 'react-redux';

const SaveAndLoad = props => {
  const storage = new Storage();
  const storedShows = useSelector(state => state.storedShows);
  const [saveModal, setSaveModal] = useState(false);
  let name = '';
  let email = '';
  let password = '';

  const saveShows = e => {
    e.preventDefault();
    storage.setItem('user', {
      shows: storedShows,
      email: email,
      password: password,
      name: name,
    });
    setSaveModal(false);
  };

  const toggleSaveModal = e => {
    e.preventDefault();
    setSaveModal(!saveModal);
  };

  return (
    <div>
      <Button size="sm" id={'save-button'} onClick={e => toggleSaveModal(e)} className="ml-1">
        Save
      </Button>
      <Modal isOpen={saveModal} toggle={toggleSaveModal}>
        <ModalHeader>Save shows</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Input placeholder="Name" onChange={event => (name = event.target.value)} />
              <br />
              <Input placeholder="Email" onChange={event => (email = event.target.value)} />
              <br />
              <Input
                placeholder="Password"
                type="password"
                onChange={event => (password = event.target.value)}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button id="submit-note" color="primary" onClick={e => saveShows(e)}>
            Submit
          </Button>{' '}
          <Button color="secondary" onClick={toggleSaveModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default SaveAndLoad;
