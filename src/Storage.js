export default class Storage {
  setItem = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  getItem = key => {
    return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null;
  };
}
