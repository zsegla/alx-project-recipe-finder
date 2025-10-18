import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export default function RecipeDetail() {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);

  const getRecipeDetails = useAction(api.recipes.getRecipeDetails);
  const addToFavorites = useMutation(api.recipes.addToFavorites);
  const removeFromFavorites = useMutation(api.recipes.removeFromFavorites);
  const addToShoppingList = useMutation(api.recipes.addToShoppingList);

  const recipeId = id || "";
  const isFavorited = useQuery(api.recipes.isFavorited, { recipeId });

  useEffect(() => {
    const fetchMeal = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const result = await getRecipeDetails({ id });
        if (result.meals && result.meals.length > 0) {
          const mealData = result.meals[0];

          const ingredients = [];
          for (let i = 1; i <= 20; i++) {
            const ingredient = mealData[`strIngredient${i}`];
            const measure = mealData[`strMeasure${i}`];
            if (ingredient && ingredient.trim()) {
              ingredients.push({
                ingredient: ingredient.trim(),
                measure: measure ? measure.trim() : "",
              });
            }
          }

          setMeal({
            idMeal: mealData.idMeal,
            strMeal: mealData.strMeal,
            strMealThumb: mealData.strMealThumb,
            strCategory: mealData.strCategory,
            strArea: mealData.strArea,
            strInstructions: mealData.strInstructions,
            strYoutube: mealData.strYoutube,
            strSource: mealData.strSource,
            ingredients,
          });
        }
      } catch (error) {
        console.error("Error fetching meal:", error);
        toast.error("Failed to load recipe details");
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [id, getRecipeDetails]);

  const handleFavoriteToggle = async () => {
    if (!meal) return;

    setIsToggling(true);
    try {
      if (isFavorited) {
        await removeFromFavorites({ recipeId });
        toast.success("Removed from favorites");
      } else {
        await addToFavorites({
          recipeId,
          recipeData: meal,
        });
        toast.success("Added to favorites");
      }
    } catch (error) {
      toast.error("Failed to update favorites");
    } finally {
      setIsToggling(false);
    }
  };

  const handleAddToShoppingList = async (ingredient) => {
    try {
      await addToShoppingList({
        ingredient: ingredient.ingredient,
        measure: ingredient.measure,
      });
      toast.success(`Added ${ingredient.ingredient} to shopping list`);
    } catch (error) {
      toast.error("Failed to add to shopping list");
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Recipe Not Found
          </h1>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            ← Back to Search
          </Link>
        </div>
      </div>
    );
  }

  const embedUrl = meal.strYoutube ? getYouTubeEmbedUrl(meal.strYoutube) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 min-h-screen">
      <Link
        to="/"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-6"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Search
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </div>

        <div>
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {meal.strMeal}
            </h1>
            <button
              onClick={handleFavoriteToggle}
              disabled={isToggling}
              className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <svg
                className={`w-6 h-6 ${isFavorited ? "text-red-500 fill-current" : "text-gray-400"}`}
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

          <div className="flex gap-4 mb-6">
            <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
              {meal.strCategory}
            </span>
            <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
              {meal.strArea}
            </span>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Ingredients
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {meal.ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg"
                >
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {ingredient.measure} {ingredient.ingredient}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddToShoppingList(ingredient)}
                    className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title="Add to shopping list"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            {meal.strSource && (
              <a
                href={meal.strSource}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Source
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )}
            {meal.strYoutube && (
              <a
                href={meal.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Watch Video
                <svg
                  className="w-4 h-4 ml-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>

      {embedUrl && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Video Tutorial
          </h3>
          <div className="aspect-video">
            <iframe
              src={embedUrl}
              title={meal.strMeal}
              className="w-full h-full rounded-lg"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Instructions
        </h3>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="prose dark:prose-invert max-w-none">
            {meal.strInstructions.split("\n").map(
              (paragraph, index) =>
                paragraph.trim() && (
                  <p
                    key={index}
                    className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed"
                  >
                    {paragraph.trim()}
                  </p>
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
