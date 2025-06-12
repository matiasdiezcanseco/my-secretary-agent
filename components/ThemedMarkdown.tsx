import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import Markdown from "react-native-markdown-display";

type ThemedMarkdownProps = {
  children: string;
};

export function ThemedMarkdown({ children }: ThemedMarkdownProps) {
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const borderColor = useThemeColor({}, "icon");

  const styles = useMemo(
    () => getStyles({ textColor, backgroundColor, borderColor }),
    [textColor, backgroundColor, borderColor]
  );

  return <Markdown style={styles}>{children}</Markdown>;
}

const getStyles = ({
  textColor,
  backgroundColor,
  borderColor,
}: {
  textColor: string;
  backgroundColor: string;
  borderColor: string;
}) =>
  StyleSheet.create({
    body: {
      backgroundColor,
      color: textColor,
      display: "flex",
      gap: 8,
    },
    blockquote: {
      backgroundColor,
    },
    code_inline: {
      backgroundColor,
      borderColor,
    },
    code_block: {
      backgroundColor,
      borderColor,
    },
    fence: {
      backgroundColor,
      borderColor,
      marginVertical: 12,
    },
    hr: {
      backgroundColor,
    },
    table: {
      borderColor,
    },
    tr: {
      borderColor,
    },
    blocklink: {
      borderColor,
    },
    list_item: {
      marginVertical: 8,
    },
  });
