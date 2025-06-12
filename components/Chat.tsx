import { useAudioRecording } from "@/hooks/useAudioRecording";
import { useThemeColor } from "@/hooks/useThemeColor";
import { generateAPIUrl } from "@/utils/generate-api-url";
import { useChat } from "@ai-sdk/react";
import { fetch as expoFetch } from "expo/fetch";
import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedMarkdown } from "./ThemedMarkdown";
import { ThemedText } from "./ThemedText";
import { ThemedTextInput } from "./ThemedTextInput";
import { ThemedView } from "./ThemedView";
import { IconSymbol } from "./ui/IconSymbol";

export function Chat() {
  const scrollViewRef = useRef<ScrollView>(null);

  const iconColor = useThemeColor({}, "icon");
  const tintColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");

  const { messages, handleInputChange, input, handleSubmit, status } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: generateAPIUrl("/api/chat"),
    onError: (error) => console.error(error, "ERROR"),
  });

  const { isRecording, isTranscribing, toggleRecording } = useAudioRecording({
    onTranscription: (transcription: string) => {
      handleInputChange({
        target: { value: transcription },
      } as any);
    },
  });

  useEffect(() => {
    if (scrollViewRef.current && messages.length > 0) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = (e: any) => {
    if (input.trim()) {
      handleSubmit(e);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
      >
        {messages.map((m) => (
          <View key={m.id} style={styles.messageContainer}>
            <View>
              <ThemedText style={styles.roleText}>{m.role}</ThemedText>
              <ThemedMarkdown>{m.content}</ThemedMarkdown>
            </View>
          </View>
        ))}
        {status === "submitted" && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color={tintColor} />
          </View>
        )}
      </ScrollView>
      <View style={styles.inputWrapper}>
        <ThemedView style={[styles.inputRow, { borderColor: iconColor }]}>
          <ThemedTextInput
            style={[styles.textInput]}
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
            style={[
              styles.micButton,
              {
                backgroundColor: isRecording ? tintColor : backgroundColor,
              },
            ]}
            disabled={isTranscribing}
          >
            <IconSymbol
              name="mic.fill"
              size={20}
              color={isRecording ? backgroundColor : iconColor}
            />
          </TouchableOpacity>
          {isTranscribing && (
            <View style={styles.transcribingIndicator}>
              <ActivityIndicator size="small" color="white" />
            </View>
          )}
          {!isTranscribing && (
            <TouchableOpacity
              onPress={sendMessage}
              style={[
                styles.sendButton,
                {
                  backgroundColor:
                    input.trim() && !isTranscribing
                      ? tintColor
                      : backgroundColor,
                },
              ]}
              disabled={!input.trim() || isTranscribing}
            >
              <IconSymbol
                name="paperplane.fill"
                size={20}
                color={
                  input.trim() && !isTranscribing ? backgroundColor : iconColor
                }
              />
            </TouchableOpacity>
          )}
        </ThemedView>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 8,
  },
  messageContainer: {
    marginVertical: 8,
  },
  roleText: {
    fontWeight: "700",
  },
  inputWrapper: {
    marginTop: 8,
    paddingHorizontal: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 4,
    borderWidth: 1,
    paddingVertical: 4,
  },
  textInput: {
    flex: 1,
    padding: 12,
  },
  micButton: {
    padding: 8,
    borderRadius: 20,
  },
  transcribingIndicator: {
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
  },
  sendButton: {
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 20,
  },
  loaderContainer: {
    alignItems: "center",
    marginVertical: 8,
  },
});
