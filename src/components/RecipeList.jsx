import React from "react";
import { useNavigate } from "react-router-dom";

function RecipeCard({ meal }) {
  const navigate = useNavigate();
  return (
    <div
      className="bg-white rounded shadow p-3 flex gap-3 cursor-pointer"
      onClick={() => navigate(`/recipe/${meal.idMeal}`, { state: { meal } })}
    >
      <img
        src={meal.strMealThumb}
        alt=""
        className="w-24 h-24 object-cover rounded"
      />
      <div>
        <h3 className="font-semibold">{meal.strMeal}</h3>
        <div className="text-sm text-gray-600">
          {meal.strCategory} • {meal.strArea}
        </div>
      </div>
    </div>
  );
}

export default function RecipeList({ recipes }) {
  if (!recipes || recipes.length === 0) {
    return <div className="mt-4 text-gray-600">No recipes to show.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-3 mt-4">
      {recipes.map((r) => (
        <RecipeCard key={r.idMeal} meal={r} />
      ))}
    </div>
  );
}
