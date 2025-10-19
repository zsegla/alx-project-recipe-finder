import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import SearchForm from "../components/SearchForm";
import RecipeList from "../components/RecipeList";
import CategoryGrid from "../components/CategoryGrid";
import { toast } from "sonner";

export default function Home() {
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const searchRecipes = useAction(api.recipes.searchRecipes);
  const getRecipesByCategory = useAction(api.recipes.getRecipesByCategory);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setHasSearched(true);
    setSearchQuery(query);
    try {
      const result = await searchRecipes({ query });
      setMeals(result.meals || []);
      if (!result.meals || result.meals.length === 0) {
        toast.info("No recipes found for your search");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search recipes. Please try again.");
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = async (category: string) => {
    setLoading(true);
    setHasSearched(true);
    setSearchQuery(`${category} recipes`);
    try {
      const result = await getRecipesByCategory({ category });
      setMeals(result.meals || []);
      if (!result.meals || result.meals.length === 0) {
        toast.info(`No recipes found in ${category} category`);
      }
    } catch (error) {
      console.error("Category search error:", error);
      toast.error("Failed to load category recipes. Please try again.");
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Find Your Perfect Recipe
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Search by dish name or browse categories to discover delicious meals
        </p>
        <SearchForm onSearch={handleSearch} loading={loading} />
      </div>

      {hasSearched && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {searchQuery ? `Results for "${searchQuery}"` : 'Search Results'}
            </h2>
            {meals.length > 0 && (
              <span className="text-gray-600 dark:text-gray-300">
                {meals.length} recipe{meals.length !== 1 ? 's' : ''} found
              </span>
            )}
          </div>
          <RecipeList meals={meals} loading={loading} />
        </div>
      )}

      {!hasSearched && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Browse by Category
          </h2>
          <CategoryGrid onCategorySelect={handleCategorySelect} />
          
          <div className="text-center py-12 mt-8">
            <div className="text-gray-400 mb-4">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Start Your Culinary Journey</h3>
            <p className="text-gray-600 dark:text-gray-300">Enter a dish name above or click a category to get started!</p>
          </div>
        </div>
      )}
    </div>
  );
}
