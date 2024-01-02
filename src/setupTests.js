const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;
//We don't want to use storage for tests
process.env.REACT_APP_STORAGE_URL = '';

export const timeout = 16000;
export const appUrl = 'http://localhost:3000';
