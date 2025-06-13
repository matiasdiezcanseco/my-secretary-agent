import { api } from "@/convex/_generated/api";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";

export function useAddIngredient() {
  const mutation = useMutation({
    mutationFn: useConvexMutation(api.ingredients.addIngredient),
  });
  return mutation;
}
