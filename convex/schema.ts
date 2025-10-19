import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  favorites: defineTable({
    userId: v.id("users"),
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
  }).index("by_user", ["userId"]).index("by_user_and_recipe", ["userId", "recipeId"]),
  
  shoppingList: defineTable({
    userId: v.id("users"),
    ingredient: v.string(),
    measure: v.string(),
    completed: v.boolean(),
  }).index("by_user", ["userId"]).index("by_user_and_ingredient", ["userId", "ingredient"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
