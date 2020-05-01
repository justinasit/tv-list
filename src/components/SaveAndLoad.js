import React, { useState } from 'react';
import Storage from '../Storage';
import {
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
import { NavLink } from 'react-router-dom';
import { NavItem } from 'reactstrap';
import HeaderLink from '../stylesheets/HeaderLink';
import DefaultButton from '../stylesheets/DefaultButton';

const SaveAndLoad = () => {
  const storage = new Storage();
  const storedShows = useSelector(state => state.storedShows);
  const [saveModal, setSaveModal] = useState(false);
  const [loadModal, setLoadModal] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
    <>
      <NavItem>
        <NavLink to="" id={'save-button'} onClick={e => toggleSaveModal(e)} className="ml-2">
          <HeaderLink>Save List</HeaderLink>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink to="" id={'load-button'} onClick={e => toggleLoadModal(e)} className="ml-2">
          <HeaderLink>Load List</HeaderLink>
        </NavLink>
      </NavItem>
      <Modal isOpen={saveModal} toggle={toggleSaveModal} size={'md'}>
        <ModalHeader>Save shows</ModalHeader>
        <ModalBody>
          <Alert color="info">
            Saving your list is completely optional as it is automatically saved in your browser.
            This means that the list will be remembered even if you close the tab or navigate away.
            <br />
            However, if you want to use a different device or a browser to access the list - you
            will have to register and load the list on your new device. This will also ensure your
            data won't get lost if your browser cache gets cleared.
          </Alert>
          {error}
          <Form>
            <FormGroup>
              <Input placeholder="Name" onChange={event => setName(event.target.value)} />
              <br />
              <Input placeholder="Email" onChange={event => setEmail(event.target.value)} />
              <br />
              <Input
                placeholder="Password"
                type="password"
                onChange={event => setPassword(event.target.value)}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <DefaultButton id="submit-note" onClick={e => saveShows(e)}>
            Submit
          </DefaultButton>
          <DefaultButton onClick={toggleSaveModal}>Cancel</DefaultButton>
        </ModalFooter>
      </Modal>
      <Modal isOpen={loadModal} toggle={toggleLoadModal}>
        <ModalHeader>Login</ModalHeader>
        <ModalBody>
          <Alert color="info">Load a previously saved list below.</Alert>
          {error}
          <Form>
            <FormGroup>
              <Input placeholder="Email" onChange={event => setEmail(event.target.value)} />
              <br />
              <Input
                placeholder="Password"
                type="password"
                onChange={event => setPassword(event.target.value)}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <DefaultButton id="submit-note" onClick={e => loadShows(e)}>
            Submit
          </DefaultButton>
          <DefaultButton onClick={toggleLoadModal}>Cancel</DefaultButton>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default SaveAndLoad;
