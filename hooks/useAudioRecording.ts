import { generateAPIUrl } from "@/utils/generate-api-url";
import { AudioModule, RecordingPresets, useAudioRecorder } from "expo-audio";
import { fetch as expoFetch } from "expo/fetch";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export function useAudioRecording({
  onTranscription,
}: {
  onTranscription: (text: string) => void;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const transcribeAudioFile = async (audioUri: string): Promise<string> => {
    try {
      const response = await fetch(audioUri);
      const audioBlob = await response.blob();

      const transcribeResponse = await expoFetch(
        generateAPIUrl("/api/transcribe"),
        {
          method: "POST",
          body: audioBlob,
          headers: {
            "Content-Type": "audio/mpeg",
          },
        }
      );

      if (!transcribeResponse.ok) {
        throw new Error(
          `Transcription failed: ${transcribeResponse.statusText}`
        );
      }

      const transcription = await transcribeResponse.text();
      return transcription.trim();
    } catch (error) {
      console.error("Error transcribing audio:", error);
      throw error;
    }
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Permission to access microphone was denied");
      }
    })();
  }, []);

  const startRecording = async () => {
    try {
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      Alert.alert("Error", "Failed to start recording");
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorder.stop();
      setIsRecording(false);

      if (audioRecorder.uri) {
        setIsTranscribing(true);
        try {
          const transcription = await transcribeAudioFile(audioRecorder.uri);
          onTranscription(transcription);
        } finally {
          setIsTranscribing(false);
        }
      }
    } catch (error) {
      console.error("Error stopping recording:", error);
      Alert.alert("Error", "Failed to process recording");
      setIsTranscribing(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return {
    isRecording,
    isTranscribing,
    toggleRecording,
    startRecording,
    stopRecording,
  };
}
