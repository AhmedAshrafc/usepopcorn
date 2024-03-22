import { useEffect, useState } from "react";

const KEY = "315ae1f2";

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      // In case the movie details of a move was opened and then you typed something else in the search bar, the movie details will automatically close!
      // This function will be called only if it actually exists!
      callback?.();

      // For the cleanup function!
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const result = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!result.ok) {
            throw new Error("Oops! Something went wrong with fetching movies!");
          }

          const data = await result.json();

          if (data.Response === "False") {
            throw new Error("Movie not found!");
          }
          setMovies(data.Search);
          setError("");
        } catch (err) {
          // This err.message is basically the string that we passed above! Which is: "Oops! Something went wrong with fetching movies!"
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          // This finally will always be executed at the very end!
          setIsLoading(false);
        }
      }

      // If there is no query (user hasn't wrote anything in the search bar), then 'fetchMovies()' below won't even be called! Basically the whole function!
      if (!query.length) {
        setMovies([]);
        setError("");
        return;
      }

      // After you finish writing your useEffect function, make sure to call it out here!
      fetchMovies();

      return () => controller.abort();
    },
    [query]
  );

  return { movies, isLoading, error };
}
