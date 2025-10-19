import { Link } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export default function RecipeCard({ meal }) {
  const [isToggling, setIsToggling] = useState(false);
  const recipeId = meal.idMeal;
  
  const isFavorited = useQuery(api.recipes.isFavorited, { recipeId });
  const addToFavorites = useMutation(api.recipes.addToFavorites);
  const removeFromFavorites = useMutation(api.recipes.removeFromFavorites);

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsToggling(true);
    try {
      if (isFavorited) {
        await removeFromFavorites({ recipeId });
        toast.success("Removed from favorites");
      } else {
        // We need to fetch full recipe data for favorites
        // For now, we'll store basic info and fetch details when needed
        await addToFavorites({
          recipeId,
          recipeData: {
            idMeal: meal.idMeal,
            strMeal: meal.strMeal,
            strMealThumb: meal.strMealThumb,
            strCategory: meal.strCategory,
            strArea: meal.strArea,
            strInstructions: "", // Will be filled when viewing details
            ingredients: [], // Will be filled when viewing details
          },
        });
        toast.success("Added to favorites");
      }
    } catch (error) {
      toast.error("Failed to update favorites");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/recipe/${meal.idMeal}`}>
        <div className="relative">
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="w-full h-48 object-cover"
          />
          <button
            onClick={handleFavoriteToggle}
            disabled={isToggling}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/90 hover:bg-white transition-colors disabled:opacity-50"
          >
            <svg
              className={`w-5 h-5 ${isFavorited ? 'text-red-500 fill-current' : 'text-gray-400'}`}
              fill={isFavorited ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
            {meal.strMeal}
          </h3>
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
              {meal.strCategory}
            </span>
            <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full text-xs">
              {meal.strArea}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
