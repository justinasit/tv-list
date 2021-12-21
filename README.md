# TV-List Overview

- This application allows you to find any of your favourite TV series. It is useful for tracking releases of new seasons and marking off the ones you watched.
- Mark off all seasons as watched and the series will move to the "Finished" category.
- Finished shows will automatically move to "Active" once a new season of a show has been released.
- Archive a show once it's over by clicking the "Archive" button.
- Optionally add a note if you need.
- Uses TMDB API (https://www.themoviedb.org/documentation/api) to fetch data.

# Prerequisites:

- Node & Yarn

# Set up TV-List:

1. Clone tv-list repository.
2. Run `yarn` to install all dependencies.
3. [Get a TMDB API key](https://koditips.com/create-tmdb-api-key/).
4. Copy `.env.example` file and name it `.env`.
5. Paste your TMDB key to your new `.env` file.
6. Use `yarn start` to run the app.

# Notes

- This project was created to follow modern React practises with the idea to make it easily extendable in the future.
