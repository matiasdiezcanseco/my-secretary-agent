import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// @snippet start schema
export default defineSchema({
  foods: defineTable({
    name: v.string(),
    quantity: v.number(),
    date: v.string(),
    unit: v.string(),
  }),
});
