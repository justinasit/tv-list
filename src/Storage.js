export default class Storage {
  storageUrl = process.env.REACT_APP_STORAGE_URL;

  async setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    try {
      return await fetch(this.storageUrl + key, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(value),
      });
    } catch (e) {
      console.log(e);
    }
  }

  async getItem(key) {
    let itemsFromStorage = [];
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
