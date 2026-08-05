import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateShipmentStatus } from "../services/shipmentService";
import { UpdateShipmentStatusPayload } from "../Types/AgentTypes";

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
    },
  });
};