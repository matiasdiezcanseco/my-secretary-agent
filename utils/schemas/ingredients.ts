import { z } from "zod";

export const ingredientsSchema = z.object({
  name: z.string().describe("Name of the food product."),
  calories: z.number().describe("Calories in the food product per 100g."),
  fat: z.number().describe("Fat content in grams per 100g."),
  protein: z.number().describe("Protein content in grams per 100g."),
  carbohydrates: z
    .number()
    .describe("Carbohydrates content in grams per 100g."),
  unit: z.enum(["g", "ml"]).describe("Unit of measurement, e.g., 'g' or 'ml'."),
  quantity: z
    .number()
    .describe(
      "Quantity of the food product without the unit. Should be 100 since all calculations were for 100g"
    ),
  ean_id: z
    .string()
    .describe(
      "Optional EAN ID for the food product. The same used to search the food."
    ),
});

export type Ingredient = z.infer<typeof ingredientsSchema>;
