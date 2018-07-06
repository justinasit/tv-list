const apiKey = 'b3487e6f673fc1e8d1fcbfa4feef3fb8';

export function searchTv(term) {
  return fetch(`https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query="${term}"`)
    .then(results => {
        return results.json();
    });
}