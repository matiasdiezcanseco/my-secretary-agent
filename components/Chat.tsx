import { generateAPIUrl } from "@/utils/generate-api-url";
import { useChat } from "@ai-sdk/react";
import { fetch as expoFetch } from "expo/fetch";
import { useEffect, useRef } from "react";
import { ScrollView, TextInput, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export function Chat() {
  const scrollViewRef = useRef<ScrollView>(null);

  const { messages, handleInputChange, input, handleSubmit } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: generateAPIUrl("/api/chat"),
    onError: (error) => console.error(error, "ERROR"),
  });

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollViewRef.current && messages.length > 0) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);
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
        <TextInput
          style={{
            backgroundColor: "white",
            padding: 12,
            borderRadius: 8,
          }}
          placeholder="Say something..."
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
            handleSubmit(e);
            e.preventDefault();
          }}
          autoFocus={true}
          textAlignVertical="top"
        />
      </View>
    </ThemedView>
  );
}
