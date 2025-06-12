import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";

import { AudioPlayerComponent } from "@/components/AudioPlayer";
import { Chat } from "@/components/Chat";
import { AudioModule, RecordingPresets, useAudioRecorder } from "expo-audio";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [audioSource, setAudioSource] = useState<string | null>(null);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);

  const record = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
    setIsRecording(true);
  };

  const stopRecording = async () => {
    await audioRecorder.stop();
    setAudioSource(audioRecorder.uri);
    setIsRecording(false);
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Permission to access microphone was denied");
      }
    })();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Button
              title={isRecording ? "Stop Recording" : "Start Recording"}
              onPress={isRecording ? stopRecording : record}
            />
            {audioSource && <AudioPlayerComponent audioSource={audioSource} />}
          </View>
          <View style={styles.chatContainer}>
            <Chat />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 8,
  },
  chatContainer: {
    flex: 1,
    marginTop: 16,
  },
});
