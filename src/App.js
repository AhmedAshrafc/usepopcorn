import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

// -----------------------------------------------------------------------------------------------------------------------------------------------

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "315ae1f2";

// STRUCTURAL COMPONENT!
export default function App() {
  const [query, setQuery] = useState("");
  // Move into the custom hook of useMovies! Commented out for reference!
  // const [movies, setMovies] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState("");
  const [selectedID, setSelectedID] = useState(null);
  // const [watched, setWatched] = useState([]);
  // Moved to a custom hook! useLocalStorageState!
  // const [watched, setWatched] = useState(function () {
  //   const storedValue = localStorage.getItem("watched");
  //   return JSON.parse(storedValue);
  // });

  const [watched, setWatched] = useLocalStorageState([], "watched");

  const handleSelectMovie = (id) => {
    setSelectedID((selectedID) => (id === selectedID ? null : id));
  };

  const handleCloseMovie = () => {
    setSelectedID(null);
  };

  const handleAddWatched = (movie) => {
    setWatched((watched) => [...watched, movie]);
  };

  const handleDeleteWatched = (id) => {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  };

  // We will store a movie in local storage each time a movie was added! So we will add the movie both in movie watched list and local storage!
  // Moved to a custom hook! useLocalStorageState!
  // useEffect(
  //   function () {
  //     localStorage.setItem("watched", JSON.stringify(watched));
  //   },
  //   [watched]
  // );

  // Coming from the custom hook useMovies!
  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);

  // This is basically how we do data fetching in simple React applications!
  // This huge block of code was extracted into a custom hook! This is commented out just for reference!
  // useEffect(
  //   function () {
  //     // For the cleanup function!
  //     const controller = new AbortController();

  //     async function fetchMovies() {
  //       try {
  //         setIsLoading(true);
  //         setError("");
  //         const result = await fetch(
  //           `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
  //           { signal: controller.signal }
  //         );

  //         if (!result.ok) {
  //           throw new Error("Oops! Something went wrong with fetching movies!");
  //         }

  //         const data = await result.json();

  //         if (data.Response === "False") {
  //           throw new Error("Movie not found!");
  //         }
  //         setMovies(data.Search);
  //         setError("");
  //       } catch (err) {
  //         // This err.message is basically the string that we passed above! Which is: "Oops! Something went wrong with fetching movies!"
  //         if (err.name !== "AbortError") {
  //           setError(err.message);
  //         }
  //       } finally {
  //         // This finally will always be executed at the very end!
  //         setIsLoading(false);
  //       }
  //     }

  //     // If there is no query (user hasn't wrote anything in the search bar), then 'fetchMovies()' below won't even be called! Basically the whole function!
  //     if (!query.length) {
  //       setMovies([]);
  //       setError("");
  //       return;
  //     }

  //     // In case the movie details of a move was opened and then you typed something else in the search bar, the movie details will automatically close!
  //     handleCloseMovie();

  //     // After you finish writing your useEffect function, make sure to call it out here!
  //     fetchMovies();

  //     return () => controller.abort();
  //   },
  //   [query]
  // );

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage messageError={error} />}
          {isLoading && <Loader />}
        </Box>

        <Box>
          {selectedID ? (
            <MovieDetails
              selectedID={selectedID}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

// -----------------------------------------------------------------------------------------------------------------------------------------------

function Loader() {
  return <p className="loader">Loading...</p>;
}

// -----------------------------------------------------------------------------------------------------------------------------------------------

function ErrorMessage({ messageError }) {
  return (
    <p className="error">
      <span>⛔</span> {messageError}
    </p>
  );
}

// -----------------------------------------------------------------------------------------------------------------------------------------------

// STRUCTURAL COMPONENT!
function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

// -----------------------------------------------------------------------------------------------------------------------------------------------

// STATELESS / PRESENTATIONAL COMPONENT!
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

// -----------------------------------------------------------------------------------------------------------------------------------------------

// STATELESS / PRESENTAIONAL COMPONENT!
function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

// -----------------------------------------------------------------------------------------------------------------------------------------------

// STATEFUL COMPONENT!
function Search({ query, setQuery }) {
  // Automatically focus on the input element once the user opens the website! (Using useRef and useEffect with empty dependency array)!
  const inputEl = useRef(null);

  useEffect(
    function () {
      function callback(e) {
        if (document.activeElement === inputEl.current) {
          return;
        }

        if (e.code === "Enter") {
          inputEl.current.focus();
          setQuery("");
        }
      }

      document.addEventListener("keydown", callback);
      return () => document.removeEventListener("keydown", callback);
    },
    [setQuery]
  );

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

// -----------------------------------------------------------------------------------------------------------------------------------------------

// STRUCTURAL COMPONENT!
function Main({ children }) {
  return <main className="main">{children}</main>;
}

// -----------------------------------------------------------------------------------------------------------------------------------------------

// STATEFUL COMPONENT!
// REUSABLE BOX COMPONENT (USING CHILDREN PROPS)!
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

// -----------------------------------------------------------------------------------------------------------------------------------------------

// STATEFUL COMPONENT!
// function WatchedBox() {
//   const [watched, setWatched] = useState(tempWatchedData);
//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <WatchedSummary watched={watched} />
//           <WatchedMoviesList watched={watched} />
//         </>
//       )}
//     </div>
//   );
// }

// -----------------------------------------------------------------------------------------------------------------------------------------------

// STATEFUL COMPONENT!
function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

// -----------------------------------------------------------------------------------------------------------------------------------------------

// STATELESS / PRESENTAIONAL COMPONENT!
function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

// -----------------------------------------------------------------------------------------------------------------------------------------------

// This component will be displayed if there is a selected ID (User clicked on a movie to see more details!)
function MovieDetails({ selectedID, onCloseMovie, onAddWatched, watched }) {
  // This piece of state will contain all the details about the movie!
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  // useRef to persist data between renders!
  const countRef = useRef(0);
  useEffect(
    function () {
      if (userRating) countRef.current = countRef.current + 1;
    },
    [userRating]
  );

  // So we can't add the same movie to watched list more than once!
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedID);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedID
  )?.userRating;

  // Destrcturing the movie object, just to change it to lowercase :p
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating: imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  const handleAdd = () => {
    const newWatchedMovie = {
      imdbID: selectedID,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  };

  // Whenever this component mounts (render for the first time) we will want to fetch the movie corresponding to the selectedID! Basically, loading the currently selected movie! This means we will want a useEffect!
  // This fetching has no error handlers. You can simpy do some error handling just like the one we did above in the App component! (Copy and paste it!)
  useEffect(
    function () {
      setIsLoading(true);
      async function getMovieDetails() {
        const result = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedID}`
        );
        const data = await result.json();
        setMovie(data);
        setIsLoading(false);
      }

      getMovieDetails();
    },
    [selectedID]
  );

  // Simply to change the page title based on the selected movie!
  useEffect(
    function () {
      if (!title) return;
      document.title = `MOVIE | ${title}`;

      return () => (document.title = `usePopcorn`);
    },
    [title]
  );

  // To go back from movie details when pressing 'esc' key!
  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          onCloseMovie();
        }
      }

      document.addEventListener("keydown", callback);

      return () => document.removeEventListener("keydown", callback);
    },
    [onCloseMovie]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>🌟</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated this movie! {watchedUserRating} <span>🌟</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------------------------------------------------------------------------

// STATELESS / PRESENTAIONAL COMPONENT!
function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------------------------------------------------------------------------

// STATELESS / PRESENTAIONAL COMPONENT!
function WatchedMoviesList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}

// -----------------------------------------------------------------------------------------------------------------------------------------------

// STATELESS / PRESENTAIONAL COMPONENT!
function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>

        <button
          className="btn-delete"
          onClick={() => onDeleteWatched(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}

// -----------------------------------------------------------------------------------------------------------------------------------------------
