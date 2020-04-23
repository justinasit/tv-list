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
  Alert,
} from 'reactstrap';
import { useSelector } from 'react-redux';

const SaveAndLoad = () => {
  const storage = new Storage();
  const storedShows = useSelector(state => state.storedShows);
  const [saveModal, setSaveModal] = useState(false);
  const [loadModal, setLoadModal] = useState(false);
  const [error, setError] = useState(null);
  let name = '';
  let email = '';
  let password = '';

  const saveShows = async e => {
    e.preventDefault();
    const response = await fetch(process.env.REACT_APP_STORAGE_URL + 'user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shows: storedShows,
        email: email,
        password: password,
        name: name,
        archivedShows: await storage.getItem('archived-shows'),
      }),
    });

    if (response.ok) {
      localStorage.setItem('x-access-token', response.headers.get('x-auth-token'));
      setSaveModal(false);
    }

    const error = await response.json();
    setError(<Alert color="danger">{error.message}</Alert>);
  };

  const loadShows = async e => {
    e.preventDefault();
    const response = await fetch(process.env.REACT_APP_STORAGE_URL + 'login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (response.ok) {
      localStorage.setItem('x-access-token', response.headers.get('x-auth-token'));
      storage.setItem('stored-shows', await storage.getItem('stored-shows'));
      storage.setItem('archived-shows', await storage.getItem('archived-shows'));
      window.location.reload();
      setLoadModal(false);
    }

    const error = await response.json();
    setError(<Alert color="danger">{error.message}</Alert>);
  };

  const toggleSaveModal = e => {
    e.preventDefault();
    setSaveModal(!saveModal);
  };

  const toggleLoadModal = e => {
    e.preventDefault();
    setLoadModal(!loadModal);
  };

  return (
    <div>
      <Button size="sm" id={'save-button'} onClick={e => toggleSaveModal(e)} className="ml-1">
        Save
      </Button>
      <Modal isOpen={saveModal} toggle={toggleSaveModal}>
        <ModalHeader>Save shows</ModalHeader>
        <ModalBody>
          {error}
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
      <Button size="sm" id={'load-button'} onClick={e => toggleLoadModal(e)} className="ml-1">
        Load
      </Button>
      <Modal isOpen={loadModal} toggle={toggleLoadModal}>
        <ModalHeader>Login</ModalHeader>
        <ModalBody>
          {error}
          <Form>
            <FormGroup>
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
          <Button id="submit-note" color="primary" onClick={e => loadShows(e)}>
            Submit
          </Button>{' '}
          <Button color="secondary" onClick={toggleLoadModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default SaveAndLoad;
