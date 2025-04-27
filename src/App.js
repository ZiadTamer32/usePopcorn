import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import useMovies from "./useMovies";
const Key = "fdaa5579";
export default function App() {
  const [selectId, setSelectId] = useState(null);
  const [watched, setWatched] = useState(function () {
    const storage = localStorage.getItem("watched");
    return storage ? JSON.parse(storage) : [];
  });
  function handleSelectId(id) {
    setSelectId((selectId) => (id === selectId ? null : id));
  }
  function handleClearSelectId() {
    setSelectId(null);
  }
  function addMovieWatched(movie) {
    setWatched((movies) => [...movies, movie]);
  }
  function deleteMovie(id) {
    setWatched(watched.filter((movie) => movie.imdbID !== id));
  }
  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );
  const { movies, loading, error, query, setQuery } = useMovies();
  return (
    <>
      <Nav>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Nav>
      <Main>
        <Box>
          {loading && <Loader />}
          {!loading && !error && (
            <FilmList movies={movies} handleSelectId={handleSelectId} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectId ? (
            <MovieSelect
              selectId={selectId}
              handleClearSelectId={handleClearSelectId}
              addMovieWatched={addMovieWatched}
              watched={watched}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <Watched watched={watched} deleteMovie={deleteMovie} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function Nav({ children }) {
  return (
    <>
      <nav className="nav-bar">{children}</nav>
    </>
  );
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function Search({ query, setQuery }) {
  const elSearch = useRef(null);
  useEffect(function () {
    elSearch.current.focus();
  }, []);
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={elSearch}
    />
  );
}
function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function MovieSelect({
  selectId,
  handleClearSelectId,
  addMovieWatched,
  watched,
}) {
  const countRate = useRef(0);
  const [details, setDetails] = useState({});
  const [Loading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectId);
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Director: director,
    Runtime: runtime,
    Actors: actors,
    Genre: genre,
    Released: released,
    Plot: plot,
    imdbRating,
  } = details;
  useEffect(
    function () {
      if (userRating) countRate.current++;
    },
    [userRating]
  );
  function Add() {
    const MovieWatched = {
      imdbID: selectId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: runtime.split(" ")[0],
      userRating: Number(userRating),
      countRate,
    };
    addMovieWatched(MovieWatched);
    handleClearSelectId();
  }
  useEffect(
    function () {
      setLoading(true);
      async function getMovieDetails() {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${Key}&i=${selectId}`
        );
        const data = await res.json();
        setDetails(data);
        setLoading(false);
      }
      getMovieDetails();
    },
    [selectId]
  );
  useEffect(
    function () {
      if (title === undefined) return;
      document.title = `Movie | ${title}`;
      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );
  return (
    <div className="details">
      {Loading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={handleClearSelectId}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${details} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxLength={10}
                    size={24}
                    onUserRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={Add}>
                      Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>You rated this movie</p>
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
function Main({ children }) {
  return (
    <>
      <main className="main">{children}</main>
    </>
  );
}
function ErrorMessage({ message }) {
  return <p className="error">⛔ {message}</p>;
}
function Loader() {
  return <p className="loader">Loading...</p>;
}
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
function FilmList({ movies, handleSelectId }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Film
          key={movie.imdbID}
          movie={movie}
          handleSelectId={handleSelectId}
        />
      ))}
    </ul>
  );
}
function Film({ movie, handleSelectId }) {
  return (
    <li onClick={() => handleSelectId(movie.imdbID)} key={movie.imdbID}>
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
function Summary({ watched }) {
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
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}
function Watched({ watched, deleteMovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          key={movie.imdbID}
          movie={movie}
          deleteMovie={deleteMovie}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, deleteMovie }) {
  return (
    <li key={movie.imdbID}>
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
          onClick={() => deleteMovie(movie.imdbID)}
          style={{ color: "white" }}
        >
          X
        </button>
      </div>
    </li>
  );
}
