export default class Storage {
  storageUrl = process.env.REACT_APP_STORAGE_URL;

  async setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    try {
      return await fetch(this.storageUrl + key, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('x-access-token'),
        },
        body: JSON.stringify(value),
      });
    } catch (e) {
      console.log(e);
    }
  }

  async getItem(key) {
    let itemsFromStorage = [];
    try {
      if (localStorage.getItem('x-access-token')) {
        itemsFromStorage = await (
          await fetch(this.storageUrl + key, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': localStorage.getItem('x-access-token'),
            },
          })
        ).json();
      }

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
