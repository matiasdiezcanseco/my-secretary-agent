import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// @snippet start schema
export default defineSchema({
  foods: defineTable({
    name: v.string(),
    quantity: v.number(),
    date: v.string(),
    unit: v.string(),
    calories: v.number(),
    carbohydrates: v.number(),
    fat: v.number(),
    protein: v.number(),
    ingredientId: v.string(), // ID of the ingredient in the database
  }),
  ingredients: defineTable({
    name: v.string(),
    calories: v.number(),
    fat: v.number(),
    protein: v.number(),
    carbohydrates: v.number(),
    unit: v.union(v.literal("g"), v.literal("ml")),
    quantity: v.number(),
    ean_id: v.optional(v.string()), // Optional unique ID for the food item
  }),
});
