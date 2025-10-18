import { useState, useEffect } from "react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function CategoryGrid({ onCategorySelect }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCategories = useAction(api.recipes.getCategories);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getCategories();
        setCategories(result.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [getCategories]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
          >
            <div className="w-full h-24 bg-gray-300"></div>
            <div className="p-3">
              <div className="h-4 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {categories.map((category) => (
        <button
          key={category.idCategory}
          onClick={() => onCategorySelect(category.strCategory)}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow text-left"
        >
          <img
            src={category.strCategoryThumb}
            alt={category.strCategory}
            className="w-full h-24 object-cover"
          />
          <div className="p-3">
            <h3 className="font-medium text-gray-900 text-sm">
              {category.strCategory}
            </h3>
          </div>
        </button>
      ))}
    </div>
  );
}
