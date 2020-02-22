export default class Storage {
  storageUrl = process.env.REACT_APP_STORAGE_URL;

  setItem = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  async getItem(key) {
    switch (key) {
      case 'storedShows':
        const result = await fetch(this.storageUrl + 'shows');
        return await result.json();
      case 'archivedShows':
        return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null;
      default:
        return '';
    }
  }
}
