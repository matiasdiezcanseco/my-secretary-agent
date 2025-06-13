import { Button, ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAddIngredient } from "@/hooks/useAddIngredient";
import { useGetIngredientByBarcode } from "@/hooks/useGetIngredient";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ingredientsSchema } from "@/utils/schemas/ingredients";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScanScreen() {
  const [facing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [barcode, setBarcode] = useState<string | null>(null);

  const { data: ingredientData } = useGetIngredientByBarcode({ barcode });
  const {
    mutate: addIngredient,
    isPending: addIngredientPending,
    isSuccess: addIngredientSuccess,
    reset: resetAddIngredient,
  } = useAddIngredient();

  const iconColor = useThemeColor({}, "icon");
  const backgroundColor = useThemeColor({}, "background");

  if (!permission || !permission.granted) {
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
          ></CameraView>
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
        <ScrollView style={{ marginTop: 16 }}>
          {ingredientData ? (
            <>
              <View style={[styles.table, { borderColor: iconColor }]}>
                {Object.entries(ingredientData).map(([key, value]) => (
                  <View
                    key={key}
                    style={[styles.tableRow, { borderBottomColor: iconColor }]}
                  >
                    <ThemedText style={styles.tableCellKey}>{key}</ThemedText>
                    <ThemedText style={styles.tableCellValue}>
                      {String(value)}
                    </ThemedText>
                  </View>
                ))}
              </View>
              <Button
                title={
                  addIngredientPending
                    ? "Saving..."
                    : addIngredientSuccess
                      ? "Saved!"
                      : "Add Ingredient"
                }
                onPress={async () => {
                  if (ingredientsSchema.safeParse(ingredientData).success) {
                    addIngredient(ingredientData);
                  }
                }}
                disabled={addIngredientPending || addIngredientSuccess}
              />
              {addIngredientPending && (
                <ThemedText style={{ textAlign: "center", marginTop: 8 }}>
                  Saving ingredient...
                </ThemedText>
              )}
              {addIngredientSuccess && (
                <ThemedText
                  style={{ textAlign: "center", marginTop: 8, color: "green" }}
                >
                  Ingredient saved!
                </ThemedText>
              )}
            </>
          ) : (
            <ThemedText>No data found.</ThemedText>
          )}
        </ScrollView>
        {barcode && (
          <Button
            title="Scan Again"
            onPress={() => {
              resetAddIngredient();
              setBarcode(null);
            }}
          />
        )}
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
  table: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  tableCellKey: {
    flex: 1,
    fontWeight: "bold",
  },
  tableCellValue: {
    flex: 2,
    marginLeft: 8,
  },
});
