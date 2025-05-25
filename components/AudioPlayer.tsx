import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAudioPlayer } from "expo-audio";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface AudioPlayerComponentProps {
  audioSource: string;
}

export function AudioPlayerComponent({
  audioSource,
}: AudioPlayerComponentProps) {
  const player = useAudioPlayer(audioSource);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const tintColor = useThemeColor({}, "icon");

  useEffect(() => {
    // Set up player status listener
    const subscription = player.addListener(
      "playbackStatusUpdate",
      (status) => {
        setIsPlaying(status.playing || false);
        setDuration(status.duration || 0);
        setPosition(status.currentTime || 0);
      }
    );

    return () => {
      subscription?.remove();
    };
  }, [player]);

  const togglePlayback = async () => {
    try {
      if (isPlaying) {
        await player.pause();
      } else {
        await player.play();
      }
    } catch (error) {
      console.error("Error toggling playback:", error);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.playButton, { backgroundColor: tintColor }]}
          onPress={togglePlayback}
        >
          <ThemedText style={styles.playButtonText}>
            {isPlaying ? "⏸️" : "▶️"}
          </ThemedText>
        </TouchableOpacity>

        <View style={styles.timeContainer}>
          <ThemedText style={styles.timeText}>
            {formatTime(position)} / {formatTime(duration)}
          </ThemedText>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View
          style={[styles.progressBar, { backgroundColor: tintColor + "30" }]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${progressPercentage}%`,
                backgroundColor: tintColor,
              },
            ]}
          />
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  playButtonText: {
    fontSize: 20,
    color: "white",
  },
  timeContainer: {
    flex: 1,
  },
  timeText: {
    fontSize: 14,
    opacity: 0.7,
  },
  progressContainer: {
    width: "100%",
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
});
