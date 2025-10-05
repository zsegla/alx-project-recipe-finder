import React from "react";
import axios from "axios";

export default function SearchBar({
  query,
  setQuery,
  setRecipes,
  setLoading,
  setError,
  setSelected,
}) {
  const search = async (e) => {
    e && e.preventDefault();
    setError(null);
    setSelected(null);
    if (!query) {
      setRecipes([]);
      return;
    }

    setLoading(true);
    try {
      const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
        query
      )}`;
      const res = await axios.get(url);
      const data = res.data;
      if (!data || !data.meals) {
        setRecipes([]);
      } else {
        setRecipes(data.meals);
      }
    } catch (err) {
      setError("Failed to fetch recipes. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={search} className="flex gap-2">
      <input
        className="flex-1 p-2 border rounded"
        placeholder="Search recipes by name, e.g. Arrabiata"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Search
      </button>
    </form>
  );
}
