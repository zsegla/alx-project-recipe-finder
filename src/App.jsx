import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import RecipeList from "./components/RecipeList";
import RecipeDetails from "./components/RecipeDetails";

export default function App() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Recipe Finder</h1>
        <SearchBar
          query={query}
          setQuery={setQuery}
          setRecipes={setRecipes}
          setLoading={setLoading}
          setError={setError}
          setSelected={setSelected}
        />

        {error && <div className="text-red-600 mt-4">{error}</div>}
        {loading && <div className="mt-4">Loading...</div>}

        {!selected ? (
          <RecipeList recipes={recipes} onSelect={setSelected} />
        ) : (
          <RecipeDetails recipe={selected} onBack={() => setSelected(null)} />
        )}
      </div>
    </div>
  );
}
