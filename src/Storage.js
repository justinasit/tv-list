export default class Storage {
  storageUrl = process.env.REACT_APP_STORAGE_URL;

  setItem = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  async getItem(key) {
    const itemsFromStorage = [];
    try {
      itemsFromStorage = await (await fetch(this.storageUrl + key)).json();

      return itemsFromStorage.length > 0
        ? itemsFromStorage
        : localStorage.getItem(key)
        ? JSON.parse(localStorage.getItem(key))
        : [];
    } catch (e) {
      return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [];
    }
  }
}
