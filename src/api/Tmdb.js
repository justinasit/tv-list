const apiKey = process.env.REACT_APP_TMDB_API_KEY;

export function searchTv(term) {
  return fetch(`https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query="${term}"`).then(
    results => {
      return results.json();
    },
  );
}

export function getInfoById(id) {
  return fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}`).then(results => {
    return results.json();
  });
}
