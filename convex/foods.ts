import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAllFoods = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("foods").collect();
  },
});

export const addFood = mutation({
  args: {
    name: v.string(),
    quantity: v.number(),
    date: v.string(),
    unit: v.union(v.literal("g"), v.literal("lb"), v.literal("oz")),
  },
  handler: async (ctx, args) => {
    const newTaskId = await ctx.db.insert("foods", { ...args });
    return newTaskId;
  },
});
