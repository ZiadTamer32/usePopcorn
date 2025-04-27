import { useEffect, useState } from "react";
const Key = "fdaa5579";
export default function useMovies() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      const contorller = new AbortController();
      async function getData() {
        try {
          setError("");
          setLoading(true);
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${Key}&s=${query}`,
            { signal: contorller.signal }
          );
          if (!res.ok) throw new Error("Something Wrong");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie Not Found");
          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setLoading(false);
        }
      }
      if (query.length < 3) {
        setError("");
        return;
      }
      // handleClearSelectId();
      getData();
      return function () {
        contorller.abort();
      };
    },
    [query]
  );
  return { movies, loading, error, setQuery, query };
}
