import { useThemeColor } from "@/hooks/useThemeColor";
import { Pressable, PressableProps, StyleSheet, ViewStyle } from "react-native";
import { ThemedText } from "./ThemedText";

interface ThemedButtonProps extends PressableProps {
  title: string;
  style?: ViewStyle;
}

export function ThemedButton({
  title,
  style,
  disabled,
  ...props
}: ThemedButtonProps) {
  const backgroundColor = useThemeColor({}, disabled ? "icon" : "background");
  const textColor = useThemeColor({}, disabled ? "text" : "text");
  const borderColor = useThemeColor({}, "icon");

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: pressed ? backgroundColor + "CC" : backgroundColor },
        { borderColor: borderColor },
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled}
      {...props}
    >
      <ThemedText style={[styles.text, { color: textColor }]}>
        {title}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
    borderWidth: 1,
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
});
