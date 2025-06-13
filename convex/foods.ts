import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAllFoods = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("foods").collect();
  },
});

export const getFoodsByDateRange = query({
  args: { beforeDate: v.string(), afterDate: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("foods")
      .filter((q) => q.gte(q.field("date"), args.afterDate))
      .filter((q) => q.lte(q.field("date"), args.beforeDate))
      .order("desc")
      .take(100);
  },
});

export const addFood = mutation({
  args: {
    name: v.string(),
    quantity: v.number(),
    date: v.string(),
    unit: v.union(v.literal("g"), v.literal("ml")),
  },
  handler: async (ctx, args) => {
    const newTaskId = await ctx.db.insert("foods", { ...args });
    return newTaskId;
  },
});
