import { api } from "@/convex/_generated/api";
import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { ConvexHttpClient } from "convex/browser";
import { z } from "zod";

const convex = new ConvexHttpClient(process.env.EXPO_PUBLIC_CONVEX_URL || "");

export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    const result = streamText({
      maxSteps: 5,
      model: openai("gpt-4o"),
      messages,
      tools: {
        getCurrentIsoTime: tool({
          description: "Get the current time",
          parameters: z.object({}).describe("No parameters needed"),
          execute: async () => {
            const now = new Date();
            return {
              time: now.toISOString(),
            };
          },
        }),
        getCurrentLocalTime: tool({
          description: "Get the current time in local format",
          parameters: z.object({}).describe("No parameters needed"),
          execute: async () => {
            const now = new Date();
            return {
              time: now.toLocaleTimeString(),
            };
          },
        }),
        addEatenFood: tool({
          description: "Add a food item to the list of eaten foods",
          parameters: z.object({
            foodName: z.string().describe("The name of the food item to add"),
            quantity: z.number().describe("The quantity of the food item"),
            date: z.string().describe("The date when the food was eaten"),
            unit: z
              .string()
              .describe("The unit of measurement for the food item"),
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
        }),
      },
    });
    return result.toDataStreamResponse({
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Encoding": "none",
      },
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
