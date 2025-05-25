import axios from "axios";
import Constants from "expo-constants";

/**
 * Sends an audio file to the STT (Speech-to-Text) service and returns the transcribed text.
 * @param audioFileUri The URI to the audio file to send.
 * @returns The transcribed text.
 */
export async function transcribeAudio(audioFileUri: string): Promise<string> {
  const formData = new FormData();
  formData.append("audio", {
    uri: audioFileUri,
    name: "audio.wav", // or the correct file name and extension
    type: "audio/wav", // or the correct mime type
  } as any); // Get STT service URL from environment variables
  const serviceUrl = Constants.expoConfig?.extra?.STT_SERVICE_URL;
  if (!serviceUrl) {
    throw new Error(
      "STT_SERVICE_URL is not defined in environment variables. Please check your .env file and app.config.js."
    );
  }

  const response = await axios.post(serviceUrl, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      // Add any other headers if needed
    },
  });

  return response.data.transcript;
}
