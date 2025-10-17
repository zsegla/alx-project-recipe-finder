import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { useFavorites } from "../contexts/FavoritesContext";

function Ingredients({ meal }) {
  const items = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const meas = meal[`strMeasure${i}`];
    if (ing && ing.trim()) items.push(`${meas || ""} ${ing}`.trim());
  }
  return (
    <ul className="list-disc pl-5 space-y-1">
      {items.map((it, idx) => (
        <li key={idx}>{it}</li>
      ))}
    </ul>
  );
}

export default function RecipeDetails({ recipe: propRecipe, onBack }) {
  const location = useLocation();
  const params = useParams();
  const [recipe, setRecipe] = useState(
    propRecipe || location.state?.meal || null
  );
  const [loading, setLoading] = useState(false);
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const isFavorite =
    recipe && favorites.some((m) => m.idMeal === recipe.idMeal);

  useEffect(() => {
    async function fetchById(id) {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        if (res.data && res.data.meals) setRecipe(res.data.meals[0]);
      } catch (e) {
        // ignore — parent handles errors
      } finally {
        setLoading(false);
      }
    }

    if (!recipe && params.id) {
      fetchById(params.id);
    }
  }, [params.id]);

  if (loading) return <div>Loading recipe...</div>;
  if (!recipe) return null;

  const youtube = recipe.strYoutube;
  const embed = youtube ? youtube.replace("watch?v=", "embed/") : null;

  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-blue-600 mb-3">
          ← Back
        </button>
        <div>
          {isFavorite ? (
            <button
              className="text-red-600 mr-2"
              onClick={() => removeFavorite(recipe.idMeal)}
            >
              Remove favorite
            </button>
          ) : (
            <button
              className="text-green-600 mr-2"
              onClick={() => addFavorite(recipe)}
            >
              Add to favorites
            </button>
          )}
        </div>
      </div>
      <div className="flex gap-4">
        <img
          src={recipe.strMealThumb}
          className="w-48 h-48 object-cover rounded"
          alt=""
        />
        <div>
          <h2 className="text-2xl font-bold">{recipe.strMeal}</h2>
          <div className="text-sm text-gray-600">
            {recipe.strCategory} • {recipe.strArea}
          </div>
          <h3 className="mt-3 font-semibold">Ingredients</h3>
          <Ingredients meal={recipe} />
        </div>
      </div>

      <h3 className="mt-4 font-semibold">Instructions</h3>
      <p className="whitespace-pre-line">{recipe.strInstructions}</p>

      {embed && (
        <div className="mt-4">
          <h4 className="font-semibold">Video</h4>
          <div className="mt-2">
            <iframe
              title="video"
              width="560"
              height="315"
              src={embed}
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {recipe.strSource && (
        <div className="mt-4">
          <a
            href={recipe.strSource}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600"
          >
            Source
          </a>
        </div>
      )}
    </div>
  );
}
