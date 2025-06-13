import { ScrollView, StyleSheet, View } from "react-native";

import { ThemedButton } from "@/components/ThemedButton";
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

  const { data: ingredientData, isLoading: ingredientDataLoading } =
    useGetIngredientByBarcode({ barcode });

  const {
    mutate: addIngredient,
    isPending: addIngredientPending,
    isSuccess: addIngredientSuccess,
    reset: resetAddIngredient,
  } = useAddIngredient();

  const iconColor = useThemeColor({}, "icon");
  const backgroundColor = useThemeColor({}, "background");

  const handleBarcodeScanned = (barcode: { data: string }) => {
    setBarcode(barcode.data);
  };

  const handleAddIngredient = () => {
    if (ingredientData && ingredientsSchema.safeParse(ingredientData).success) {
      addIngredient(ingredientData);
    }
  };

  const handleScanAgain = () => {
    resetAddIngredient();
    setBarcode(null);
  };

  if (!permission || !permission.granted) {
    return (
      <SafeAreaView
        style={[styles.flex1, { backgroundColor: backgroundColor }]}
        edges={["top", "left", "right", "bottom"]}
      >
        <View style={[styles.container, styles.justifyCenter]}>
          <ThemedText style={styles.message}>
            We need your permission to show the camera
          </ThemedText>
          <ThemedButton onPress={requestPermission} title="Grant permission" />
        </View>
      </SafeAreaView>
    );
  }

  if (!barcode) {
    return (
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "upc_a", "upc_e", "ean8"],
        }}
      ></CameraView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.flex1, { backgroundColor: backgroundColor }]}
      edges={["top", "left", "right"]}
    >
      <ThemedView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {ingredientDataLoading && (
            <ThemedText style={styles.loadingText}>
              Loading ingredient...
            </ThemedText>
          )}
          {!ingredientDataLoading && ingredientData && (
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
              <ThemedButton
                title={
                  addIngredientPending
                    ? "Saving..."
                    : addIngredientSuccess
                      ? "Saved!"
                      : "Add Ingredient"
                }
                onPress={handleAddIngredient}
                disabled={addIngredientPending || addIngredientSuccess}
              />
            </>
          )}
          {!ingredientDataLoading && !ingredientData && (
            <ThemedText>No data found.</ThemedText>
          )}
        </ScrollView>
        {barcode && (
          <ThemedButton title="Scan Again" onPress={handleScanAgain} />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  justifyCenter: {
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  scrollView: {
    marginTop: 16,
  },
  loadingText: {
    textAlign: "center",
    marginVertical: 16,
  },
  savingText: {
    textAlign: "center",
    marginTop: 8,
  },
  savedText: {
    textAlign: "center",
    marginTop: 8,
    color: "green",
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
