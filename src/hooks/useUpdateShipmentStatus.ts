import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateShipmentStatus } from "../services/shipmentService";
import type { UpdateShipmentStatusPayload } from "../Types/AgentTypes";
import { showToast } from "../utils/toast";

export const useUpdateShipmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      shipmentId,
      payload,
    }: {
      shipmentId: string;
      payload: UpdateShipmentStatusPayload;
    }) => {
      console.log("Updating shipment:", {
        shipmentId,
        payload,
      });

      const response = await updateShipmentStatus(
        shipmentId,
        payload
      );

      console.log("Update response:", response);

      return response;
    },

    onSuccess: () => {
      console.log("Mutation success");

      queryClient.invalidateQueries({
        queryKey: ["agent-orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["agentOrderDetails"],
      });

      showToast(
        "Shipment status updated successfully.",
        "success"
      );
    },

    onError: (error) => {
      console.error("Mutation error:", error);

      showToast(
        "Failed to update shipment status.",
        "error"
      );
    },
  });
};