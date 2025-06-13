import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import {
  addEatenFood,
  getCurrentIsoTime,
  getCurrentLocalTime,
  getIngredientByName,
} from "./_tools";

export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    const result = streamText({
      maxSteps: 15,
      model: openai("gpt-4o"),
      messages,
      tools: {
        getCurrentIsoTime,
        addEatenFood,
        getCurrentLocalTime,
        getIngredientByName,
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
