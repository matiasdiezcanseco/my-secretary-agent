import { useThemeColor } from "@/hooks/useThemeColor";
import { TextInput, type TextInputProps } from "react-native";

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedTextInput({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedTextInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <TextInput
      style={[{ color, backgroundColor }, style]}
      placeholderTextColor={color + "99"}
      {...otherProps}
    />
  );
}
