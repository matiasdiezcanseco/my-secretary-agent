import { openai } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import { z } from "zod";
import { getFoodNutritionalInformation } from "./_tools";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  try {
    const { experimental_output } = await generateText({
      maxSteps: 5,
      model: openai("gpt-4o"),
      system: `You recieve an id of a food product and you can use the tools to get their nutritional information. 
        You need to return at least the following information:
        - productName: The name of the food product
        - calories: Calories in the food product per 100g
        - fat: Fat content in grams per 100g
        - protein: Protein content in grams per 100g
        - carbohydrates: Carbohydrates content in grams per 100g
      You can add extra information if you find it useful, but you must return at least the above information.`,
      experimental_output: Output.object({
        schema: z.object({
          productName: z.string().describe("Name of the food product."),
          calories: z
            .number()
            .describe("Calories in the food product per 100g."),
          fat: z.number().describe("Fat content in grams per 100g."),
          protein: z.number().describe("Protein content in grams per 100g."),
          carbohydrates: z
            .number()
            .describe("Carbohydrates content in grams per 100g."),
        }),
      }),
      prompt: `The food product id is ${id}.`,
      tools: { getFoodNutritionalInformation },
    });

    return Response.json(experimental_output, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error in chat API:", e);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: e instanceof Error ? e.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
