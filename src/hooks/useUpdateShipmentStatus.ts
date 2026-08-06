import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateShipmentStatus } from "../services/shipmentService";
import type { UpdateShipmentStatusPayload } from "../Types/AgentTypes";
import { showToast } from "../utils/toast";

export const useUpdateShipmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      shipmentId,
      payload,
    }: {
      shipmentId: string;
      payload: UpdateShipmentStatusPayload;
    }) => updateShipmentStatus(shipmentId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["agent-orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["agentOrderDetails"],
      });

      showToast("Shipment status updated successfully.", "success");
    },

    onError: () => {
      showToast("Failed to update shipment status.", "error");
    },
  });
};