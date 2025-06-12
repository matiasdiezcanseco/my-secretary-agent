import { createClient } from "@deepgram/sdk";

export async function POST(req: Request) {
  try {
    // Get the audio data as an array buffer
    const audioBuffer = await req.arrayBuffer();
    const audioData = Buffer.from(audioBuffer);

    console.log(`Received audio data: ${audioData.length} bytes`);

    const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      // Use the audio buffer directly instead of reading from file
      audioData,
      // Configure Deepgram options for audio analysis
      {
        model: "nova-3",
        smart_format: true,
      }
    );

    if (error) {
      console.error("Deepgram error:", error);
      return new Response("Transcription failed", { status: 500 });
    }

    const fullTranscription =
      result?.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";

    return new Response(fullTranscription.trim(), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Transcription error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
