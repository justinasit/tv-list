import * as Tmdb from './Tmdb';

export async function searchTv(term) {
  return await Tmdb.searchTv(term);
}

export async function getInfoById(id) {
  return await Tmdb.getInfoById(id);
}
