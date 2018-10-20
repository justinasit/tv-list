const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
  };
  global.localStorage = localStorageMock;

  export const timeout = 16000;
  export const appUrl = 'http://localhost:3000';