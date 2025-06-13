import { generateAPIUrl } from "@/utils/generate-api-url";
import { Ingredient } from "@/utils/schemas/ingredients";
import { useQuery } from "@tanstack/react-query";
import { fetch as expoFetch } from "expo/fetch";

export function useGetIngredientByBarcode({
  barcode,
}: {
  barcode: string | null;
}) {
  const query = useQuery({
    queryKey: ["scan", barcode],
    queryFn: async () => {
      if (!barcode) return undefined;
      const data = await expoFetch(generateAPIUrl(`/api/scan?id=${barcode}`), {
        method: "GET",
      });
      return (await data.json()) as Ingredient;
    },
    enabled: !!barcode,
  });
  return query;
}
