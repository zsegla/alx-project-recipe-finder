import React from "react";
import { useFavorites } from "../contexts/FavoritesContext";
import { useNavigate } from "react-router-dom";

export default function Favorites() {
  const { favorites, removeFavorite } = useFavorites();
  const navigate = useNavigate();

  if (!favorites || favorites.length === 0) {
    return <div className="mt-4 text-gray-600">No favorites yet.</div>;
  }

  return (
    <div className="mt-4 grid grid-cols-1 gap-3">
      {favorites.map((meal) => (
        <div
          key={meal.idMeal}
          className="bg-white p-3 rounded shadow flex items-center justify-between"
        >
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() =>
              navigate(`/recipe/${meal.idMeal}`, { state: { meal } })
            }
          >
            <img
              src={meal.strMealThumb}
              alt=""
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <div className="font-semibold">{meal.strMeal}</div>
              <div className="text-sm text-gray-600">
                {meal.strArea} • {meal.strCategory}
              </div>
            </div>
          </div>
          <div>
            <button
              className="text-sm text-red-600"
              onClick={() => removeFavorite(meal.idMeal)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
