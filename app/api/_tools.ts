import { api } from "@/convex/_generated/api";
import { tool } from "ai";
import { ConvexHttpClient } from "convex/browser";
import { z } from "zod";

const convex = new ConvexHttpClient(process.env.EXPO_PUBLIC_CONVEX_URL || "");

export const getCurrentIsoTime = tool({
  description: "Get the current time",
  parameters: z.object({}).describe("No parameters needed"),
  execute: async () => {
    const now = new Date();
    return {
      time: now.toISOString(),
    };
  },
});

export const getCurrentLocalTime = tool({
  description: "Get the current time in local format",
  parameters: z.object({}).describe("No parameters needed"),
  execute: async () => {
    const now = new Date();
    return {
      time: now.toLocaleTimeString(),
    };
  },
});

export const getFoodNutritionalInformation = tool({
  description: "Get nutritional information for a food item by its ID",
  parameters: z.object({
    id: z
      .string()
      .describe("The ID of the food item to get nutritional information for"),
  }),
  execute: async ({ id }) => {
    const apiUrl = `https://world.openfoodfacts.org/api/v0/product/${id}.json`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      return {
        success: false,
        message: `Failed to fetch nutritional information for food ID ${id}. Status: ${response.status}`,
      };
    }

    const data = await response.json();

    return {
      success: true,
      message: `Fetched nutritional information for food ID ${id}.`,
      nutritionalInfo: data,
    };
  },
});

export const addEatenFood = tool({
  description: "Add a food item to the list of eaten foods",
  parameters: z.object({
    foodName: z.string().describe("The name of the food item to add"),
    quantity: z.number().describe("The quantity of the food item"),
    date: z.string().describe("The date when the food was eaten"),
    unit: z
      .enum(["g", "lb", "oz"])
      .describe("The unit of measurement for the food item (mass units)"),
  }),
  execute: async ({ foodName, date, quantity, unit }) => {
    try {
      const foodId = await convex.mutation(api.foods.addFood, {
        name: foodName,
        date,
        quantity,
        unit,
      });

      return {
        success: true,
        message: `Added ${foodName} to the list of eaten foods.`,
        addedFood: {
          id: foodId,
          name: foodName,
          date: date,
          quantity: quantity,
          unit: unit,
        },
      };
    } catch (e) {
      console.error("Error adding food:", e);
      return {
        success: false,
        message: `Failed to add ${foodName} to the list of eaten foods. Error: ${e instanceof Error ? e.message : "Unknown error"}`,
        error: e instanceof Error ? e.message : "Unknown error",
      };
    }
  },
});
