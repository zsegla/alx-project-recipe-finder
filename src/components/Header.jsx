import React from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../contexts/FavoritesContext";

export default function Header() {
  const { favorites } = useFavorites();
  return (
    <header className="flex items-center justify-between mb-6">
      <Link to="/" className="text-xl font-bold">
        Recipe Finder
      </Link>
      <nav>
        <Link to="/favorites" className="mr-4 text-gray-700">
          Favorites
        </Link>
        <span className="text-sm text-gray-500">{favorites.length} saved</span>
      </nav>
    </header>
  );
}
