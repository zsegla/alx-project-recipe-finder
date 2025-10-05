import React from "react";

function RecipeCard({ meal, onSelect }) {
  return (
    <div
      className="bg-white rounded shadow p-3 flex gap-3 cursor-pointer"
      onClick={() => onSelect(meal)}
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

export default function RecipeList({ recipes, onSelect }) {
  if (!recipes || recipes.length === 0) {
    return <div className="mt-4 text-gray-600">No recipes to show.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-3 mt-4">
      {recipes.map((r) => (
        <RecipeCard key={r.idMeal} meal={r} onSelect={onSelect} />
      ))}
    </div>
  );
}
