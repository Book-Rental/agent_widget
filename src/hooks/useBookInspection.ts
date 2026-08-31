import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createBookInspection } from "../services/shipmentService";
import { showToast } from "../utils/toast";

interface BookInspectionPayload {
  shipmentId: string;
  formData: FormData;
}

export const useBookInspection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      shipmentId,
      formData,
    }: BookInspectionPayload) => {
      console.log("Creating book inspection:", shipmentId);

      const response = await createBookInspection(
        shipmentId,
        formData
      );

      console.log(
        "Book inspection response:",
        response
      );

      return response;
    },

    onSuccess: () => {
      console.log("Book inspection successful");

      queryClient.invalidateQueries({
        queryKey: ["agent-orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["agentOrderDetails"],
      });

      showToast(
        "Book inspection completed successfully.",
        "success"
      );
    },

    onError: (error) => {
      console.error(
        "Book inspection error:",
        error
      );

      showToast(
        "Failed to complete book inspection.",
        "error"
      );
    },
  });
};