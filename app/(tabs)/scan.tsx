import { Button, StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScanScreen() {
  const backgroundColor = useThemeColor({}, "background");

  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [barcode, setBarcode] = useState<string | null>(null);

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  if (!permission || !permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <ThemedText style={styles.message}>
          We need your permission to show the camera
        </ThemedText>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  if (!barcode) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: backgroundColor }}
        edges={["top", "left", "right", "bottom"]}
      >
        <View style={styles.container}>
          <CameraView
            style={styles.camera}
            facing={facing}
            onBarcodeScanned={(barcode) => {
              setBarcode(barcode.data);
            }}
            barcodeScannerSettings={{
              barcodeTypes: [
                "aztec",
                "ean13",
                "ean8",
                "qr",
                "pdf417",
                "upc_e",
                "datamatrix",
                "code39",
                "code93",
                "itf14",
                "codabar",
                "code128",
                "upc_a",
              ],
            }}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={toggleCameraFacing}
              >
                <ThemedText style={styles.text}>Flip Camera</ThemedText>
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: backgroundColor }}
      edges={["top", "left", "right", "bottom"]}
    >
      <ThemedView style={styles.container}>
        <ThemedText style={styles.message}>{barcode}</ThemedText>
        <Button
          title="Scan Again"
          onPress={() => {
            setBarcode(null);
          }}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 32,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
