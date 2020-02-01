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

/* Map show data from the API to our shows object */
export function mapApiDataToObject(apiData, showIdIndex, note) {
  return {
    name: apiData.name,
    number_of_seasons: apiData.number_of_seasons,
    last_aired_season: apiData.last_episode_to_air.season_number,
    showIdIndex: showIdIndex,
    id: apiData.id,
    note: note,
  };
}
