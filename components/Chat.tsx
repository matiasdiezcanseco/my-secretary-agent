import { generateAPIUrl } from "@/utils/generate-api-url";
import { useChat } from "@ai-sdk/react";
import { fetch as expoFetch } from "expo/fetch";
import { ScrollView, Text, TextInput, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export function Chat() {
  const { messages, error, handleInputChange, input, handleSubmit } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: generateAPIUrl("/api/chat"),
    onError: (error) => console.error(error, "ERROR"),
  });

  if (error) return <Text>{error.message}</Text>;

  return (
    <ThemedView
      style={{
        paddingHorizontal: 8,
      }}
    >
      <ScrollView style={{ flex: 1 }}>
        {messages.map((m) => (
          <View key={m.id} style={{ marginVertical: 8 }}>
            <View>
              <ThemedText style={{ fontWeight: 700 }}>{m.role}</ThemedText>
              <ThemedText>{m.content}</ThemedText>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={{ marginTop: 8 }}>
        <TextInput
          style={{ backgroundColor: "white", padding: 8 }}
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
        />
      </View>
    </ThemedView>
  );
}
