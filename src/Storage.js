export default class Storage {
  setItem = (key, value) => {
    JSON.stringify(localStorage.setItem(key, value));
  }

  getItem = (key) => {
    return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null;
  }
}