import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Search recipes using TheMealDB API
export const searchRecipes = action({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(args.query)}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Recipe search error:", error);
      throw new Error("Failed to search recipes");
    }
  },
});

// Get recipe details by ID
export const getRecipeDetails = action({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${args.id}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Recipe details error:", error);
      throw new Error("Failed to get recipe details");
    }
  },
});

// Get recipes by category
export const getRecipesByCategory = action({
  args: {
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(args.category)}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Category recipes error:", error);
      throw new Error("Failed to get recipes by category");
    }
  },
});

// Get all categories
export const getCategories = action({
  args: {},
  handler: async (ctx) => {
    const url = "https://www.themealdb.com/api/json/v1/1/categories.php";
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Categories error:", error);
      throw new Error("Failed to get categories");
    }
  },
});

// Add recipe to favorites
export const addToFavorites = mutation({
  args: {
    recipeId: v.string(),
    recipeData: v.object({
      idMeal: v.string(),
      strMeal: v.string(),
      strMealThumb: v.string(),
      strCategory: v.string(),
      strArea: v.string(),
      strInstructions: v.string(),
      strYoutube: v.optional(v.string()),
      strSource: v.optional(v.string()),
      ingredients: v.array(v.object({
        ingredient: v.string(),
        measure: v.string(),
      })),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to add favorites");
    }

    // Check if already favorited
    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user_and_recipe", (q) => 
        q.eq("userId", userId).eq("recipeId", args.recipeId)
      )
      .unique();

    if (existing) {
      throw new Error("Recipe already in favorites");
    }

    return await ctx.db.insert("favorites", {
      userId,
      recipeId: args.recipeId,
      recipeData: args.recipeData,
    });
  },
});

// Remove recipe from favorites
export const removeFromFavorites = mutation({
  args: {
    recipeId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to remove favorites");
    }

    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_user_and_recipe", (q) => 
        q.eq("userId", userId).eq("recipeId", args.recipeId)
      )
      .unique();

    if (!favorite) {
      throw new Error("Recipe not in favorites");
    }

    await ctx.db.delete(favorite._id);
    return { success: true };
  },
});

// Get user's favorite recipes
export const getFavorites = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return favorites;
  },
});

// Check if recipe is favorited
export const isFavorited = query({
  args: {
    recipeId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return false;
    }

    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_user_and_recipe", (q) => 
        q.eq("userId", userId).eq("recipeId", args.recipeId)
      )
      .unique();

    return !!favorite;
  },
});

// Add recipe to shopping list
export const addToShoppingList = mutation({
  args: {
    ingredient: v.string(),
    measure: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to add to shopping list");
    }

    // Check if ingredient already exists
    const existing = await ctx.db
      .query("shoppingList")
      .withIndex("by_user_and_ingredient", (q) => 
        q.eq("userId", userId).eq("ingredient", args.ingredient)
      )
      .unique();

    if (existing) {
      // Update existing item
      await ctx.db.patch(existing._id, {
        measure: args.measure,
        completed: false,
      });
      return existing._id;
    } else {
      // Add new item
      return await ctx.db.insert("shoppingList", {
        userId,
        ingredient: args.ingredient,
        measure: args.measure,
        completed: false,
      });
    }
  },
});

// Get shopping list
export const getShoppingList = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const items = await ctx.db
      .query("shoppingList")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return items;
  },
});

// Toggle shopping list item completion
export const toggleShoppingItem = mutation({
  args: {
    itemId: v.id("shoppingList"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const item = await ctx.db.get(args.itemId);
    if (!item || item.userId !== userId) {
      throw new Error("Item not found");
    }

    await ctx.db.patch(args.itemId, {
      completed: !item.completed,
    });
  },
});

// Remove shopping list item
export const removeShoppingItem = mutation({
  args: {
    itemId: v.id("shoppingList"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const item = await ctx.db.get(args.itemId);
    if (!item || item.userId !== userId) {
      throw new Error("Item not found");
    }

    await ctx.db.delete(args.itemId);
  },
});
