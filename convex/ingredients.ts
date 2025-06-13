import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getIngredientByEanId = query({
  args: { eanId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("ingredients")
      .filter((q) => q.eq(q.field("ean_id"), args.eanId))
      .order("desc")
      .take(1);
  },
});

export const getIngredientByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("ingredients")
      .filter((q) => q.eq(q.field("name"), args.name))
      .order("desc")
      .take(1);
  },
});

export const searchIngredientsByName = query({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("ingredients")
      .filter((q) => q.eq(q.field("name"), args.name))
      .order("desc")
      .take(100);
  },
});

export const addIngredient = mutation({
  args: {
    name: v.string(),
    calories: v.number(),
    fat: v.number(),
    protein: v.number(),
    carbohydrates: v.number(),
    unit: v.union(v.literal("g"), v.literal("ml")),
    quantity: v.number(),
    ean_id: v.optional(v.string()), // Optional ID for the food item
  },
  handler: async (ctx, args) => {
    // Check if the ingredient already exists by EAN ID
    if (args.ean_id) {
      const existingIngredient = await ctx.db
        .query("ingredients")
        .filter((q) => q.eq(q.field("ean_id"), args.ean_id))
        .order("desc")
        .take(1);

      if (existingIngredient.length > 0) {
        console.log("Ingredient already exists with EAN ID:", args.ean_id);
        return existingIngredient[0]._id;
      }
    }

    const newIngredientId = await ctx.db.insert("ingredients", { ...args });
    return newIngredientId;
  },
});
