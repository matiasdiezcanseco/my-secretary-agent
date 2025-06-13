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

export const getIngredientByName = tool({
  description: "Get ingredient details by name",
  parameters: z.object({
    name: z.string().describe("The name of the ingredient to search for"),
  }),
  execute: async ({ name }) => {
    try {
      const [ingredient] = await convex.query(
        api.ingredients.getIngredientByName,
        { name }
      );

      console.log("name:", name);
      console.log("Ingredient found:", ingredient);

      if (!ingredient) {
        return {
          success: false,
          message: `No ingredient found with the name "${name}".`,
        };
      }

      return {
        success: true,
        message: `Found ingredient: ${ingredient.name}`,
        ingredient,
      };
    } catch (e) {
      console.error("Error fetching ingredient:", e);
      return {
        success: false,
        message: `Failed to fetch ingredient "${name}". Error: ${e instanceof Error ? e.message : "Unknown error"}`,
        error: e instanceof Error ? e.message : "Unknown error",
      };
    }
  },
});

export const addIngredient = tool({
  description: "Add a new ingredient to the database",
  parameters: z.object({
    name: z.string().describe("The name of the ingredient"),
    calories: z.number().describe("Calories in the ingredient"),
    fat: z.number().describe("Grams of fat in the ingredient"),
    protein: z.number().describe("Grams of protein in the ingredient"),
    carbohydrates: z
      .number()
      .describe("Grams of carbohydrates in the ingredient"),
    unit: z
      .enum(["g", "ml"])
      .describe("The unit of measurement for the ingredient (mass units)"),
    quantity: z.number().describe("Quantity of the ingredient"),
    ean_id: z
      .string()
      .optional()
      .describe("Optional unique ID for the food item (EAN code)"),
  }),
  execute: async (args) => {
    try {
      const ingredientId = await convex.mutation(
        api.ingredients.addIngredient,
        args
      );

      return {
        success: true,
        message: `Added ingredient ${args.name} to the database.`,
        addedIngredient: { args, id: ingredientId },
      };
    } catch (e) {
      console.error("Error adding ingredient:", e);
      return {
        success: false,
        message: `Failed to add ingredient ${name}. Error: ${e instanceof Error ? e.message : "Unknown error"}`,
        error: e instanceof Error ? e.message : "Unknown error",
      };
    }
  },
});

export const addEatenFood = tool({
  description: "Add a food item to the list of eaten foods",
  parameters: z.object({
    name: z.string().describe("The name of the food item to add"),
    quantity: z.number().describe("The quantity of the food item"),
    date: z.string().describe("The date when the food was eaten"),
    unit: z
      .enum(["g", "ml"])
      .describe("The unit of measurement for the food item (mass units)"),
    ingredient_id: z
      .string()
      .describe("The ID of the ingredient in the database"),
    calories: z.number().describe("Calories in the food item"),
    fat: z.number().describe("Grams of fat in the food item"),
    protein: z.number().describe("Grams of protein in the food item"),
    carbohydrates: z
      .number()
      .describe("Grams of carbohydrates in the food item"),
  }),
  execute: async ({
    name,
    date,
    quantity,
    unit,
    calories,
    carbohydrates,
    fat,
    ingredient_id,
    protein,
  }) => {
    try {
      const foodId = await convex.mutation(api.foods.addFood, {
        name: name.toLowerCase(),
        date,
        quantity,
        unit,
        fat,
        protein,
        calories,
        carbohydrates,
        ingredient_id,
      });

      return {
        success: true,
        message: `Added ${name} to the list of eaten foods.`,
        addedFood: {
          id: foodId,
          name,
          date: date,
          quantity: quantity,
          unit: unit,
        },
      };
    } catch (e) {
      console.error("Error adding food:", e);
      return {
        success: false,
        message: `Failed to add ${name} to the list of eaten foods. Error: ${e instanceof Error ? e.message : "Unknown error"}`,
        error: e instanceof Error ? e.message : "Unknown error",
      };
    }
  },
});
