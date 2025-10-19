import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

export default function ShoppingList() {
  const shoppingList = useQuery(api.recipes.getShoppingList);
  const toggleShoppingItem = useMutation(api.recipes.toggleShoppingItem);
  const removeShoppingItem = useMutation(api.recipes.removeShoppingItem);

  const handleToggleItem = async (itemId: Id<"shoppingList">) => {
    try {
      await toggleShoppingItem({ itemId });
    } catch (error) {
      toast.error("Failed to update item");
    }
  };

  const handleRemoveItem = async (itemId: Id<"shoppingList">) => {
    try {
      await removeShoppingItem({ itemId });
      toast.success("Item removed from shopping list");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  if (shoppingList === undefined) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 min-h-screen">
        <div className="flex justify-center items-center min-h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const completedItems = shoppingList.filter(item => item.completed);
  const pendingItems = shoppingList.filter(item => !item.completed);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shopping List</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {shoppingList.length} item{shoppingList.length !== 1 ? 's' : ''} total
            {completedItems.length > 0 && ` • ${completedItems.length} completed`}
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Find More Recipes
        </Link>
      </div>

      {shoppingList.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Your shopping list is empty</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Add ingredients from recipe details to build your shopping list!
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Recipes
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingItems.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                To Buy ({pendingItems.length})
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm divide-y divide-gray-200 dark:divide-gray-700">
                {pendingItems.map((item) => (
                  <div key={item._id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <button
                        onClick={() => handleToggleItem(item._id)}
                        className="mr-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded"></div>
                      </button>
                      <div>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {item.ingredient}
                        </span>
                        {item.measure && (
                          <span className="text-gray-600 dark:text-gray-300 ml-2">
                            ({item.measure})
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {completedItems.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Completed ({completedItems.length})
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm divide-y divide-gray-200 dark:divide-gray-700">
                {completedItems.map((item) => (
                  <div key={item._id} className="p-4 flex items-center justify-between opacity-60">
                    <div className="flex items-center">
                      <button
                        onClick={() => handleToggleItem(item._id)}
                        className="mr-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </button>
                      <div>
                        <span className="text-gray-900 dark:text-white font-medium line-through">
                          {item.ingredient}
                        </span>
                        {item.measure && (
                          <span className="text-gray-600 dark:text-gray-300 ml-2 line-through">
                            ({item.measure})
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
