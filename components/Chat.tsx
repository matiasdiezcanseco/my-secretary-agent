import { useThemeColor } from "@/hooks/useThemeColor";
import { transcribeAudio } from "@/services/transcribe";
import { generateAPIUrl } from "@/utils/generate-api-url";
import { useChat } from "@ai-sdk/react";
import { AudioModule, RecordingPresets, useAudioRecorder } from "expo-audio";
import { fetch as expoFetch } from "expo/fetch";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { IconSymbol } from "./ui/IconSymbol";

export function Chat() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const { messages, handleInputChange, input, handleSubmit } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: generateAPIUrl("/api/chat"),
    onError: (error) => console.error(error, "ERROR"),
  });

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const iconColor = useThemeColor({}, "icon");

  // Request recording permissions on mount
  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Permission to access microphone was denied");
      }
    })();
  }, []);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollViewRef.current && messages.length > 0) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

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
        // Show transcribing state
        setIsTranscribing(true);
        try {
          // Transcribe the audio and set it as input
          const transcription = await transcribeAudio(audioRecorder.uri);
          handleInputChange({
            target: { value: transcription },
          } as any);
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

  const sendMessage = (e: any) => {
    if (input.trim()) {
      handleSubmit(e);
    }
  };
  return (
    <ThemedView
      style={{
        flex: 1,
      }}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ paddingHorizontal: 8 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
      >
        {messages.map((m) => (
          <View key={m.id} style={{ marginVertical: 8 }}>
            <View>
              <ThemedText style={{ fontWeight: 700 }}>{m.role}</ThemedText>
              <ThemedText>{m.content}</ThemedText>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={{ marginTop: 8, paddingHorizontal: 8 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: 8,
            paddingRight: 4,
          }}
        >
          <TextInput
            style={{
              flex: 1,
              padding: 12,
            }}
            placeholder={
              isTranscribing ? "Transcribing audio..." : "Say something..."
            }
            value={input}
            onChange={(e) =>
              handleInputChange({
                ...e,
                target: {
                  ...e.target,
                  value: e.nativeEvent.text,
                },
              } as unknown as React.ChangeEvent<HTMLInputElement>)
            }
            onSubmitEditing={(e) => {
              sendMessage(e);
              e.preventDefault();
            }}
            autoFocus={true}
            textAlignVertical="top"
            editable={!isTranscribing}
          />
          <TouchableOpacity
            onPress={toggleRecording}
            style={{
              padding: 8,
              marginHorizontal: 4,
              borderRadius: 20,
              backgroundColor: isRecording ? "#ff4444" : "#f0f0f0",
            }}
            disabled={isTranscribing}
          >
            <IconSymbol
              name="mic.fill"
              size={20}
              color={isRecording ? "white" : iconColor}
            />
          </TouchableOpacity>
          {isTranscribing && (
            <View
              style={{
                padding: 8,
                marginHorizontal: 4,
                borderRadius: 20,
                backgroundColor: "#4CAF50",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="small" color="white" />
            </View>
          )}
          <TouchableOpacity
            onPress={sendMessage}
            style={{
              padding: 8,
              marginHorizontal: 4,
              borderRadius: 20,
              backgroundColor:
                input.trim() && !isTranscribing ? iconColor : "#f0f0f0",
            }}
            disabled={!input.trim() || isTranscribing}
          >
            <IconSymbol
              name="paperplane.fill"
              size={20}
              color={input.trim() && !isTranscribing ? "white" : "#ccc"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}
